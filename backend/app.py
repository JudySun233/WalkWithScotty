import os
import json
import re
import random
import asyncio
from datetime import datetime
from typing import Dict, List, Any

from llama_index.core.workflow import (
    Event,
    StartEvent,
    StopEvent,
    Workflow,
    step,
    Context,
)
from llama_index.core.tools import FunctionTool
from llama_index.core.agent import ReActAgent
from llama_index.llms.google_genai import GoogleGenAI

from dotenv import load_dotenv

load_dotenv()

# === MOCK DB ===
class DBUtils:
    def get_from_db_last_workout(self) -> int:
        # Returns how many days since last workout. Mocked for testing.
        return 3


# === TOOL FUNCTION DEFINITIONS ===

def check_calendar(**kwargs) -> str:
    busy_times = ["9:00 AM - 10:00 AM", "2:00 PM - 3:00 PM"]
    return f"User is busy during: {', '.join(busy_times)}"

def check_weather(**kwargs) -> str:
    weather_conditions = ["Sunny", "Cloudy", "Raining", "Snowing", "Windy"]
    return f"The current weather is {random.choice(weather_conditions)}."

def check_time_of_day(**kwargs) -> str:
    hour = datetime.now().hour
    return "Morning" if 5 <= hour < 12 else "Afternoon" if 12 <= hour < 17 else "Evening" if 17 <= hour < 21 else "Night"

def get_current_location(**kwargs) -> Dict[str, float]:
    return {"latitude": 40.444, "longitude": -79.945}  # CMU

def get_landmark_location(**kwargs) -> List[Dict[str, Any]]:
    return [
        {"name": "Posner Hall - CMU", "latitude": 40.442, "longitude": -79.950},
        {"name": "Westinghouse memorial", "latitude": 40.443, "longitude": -79.953},
        {"name": "Phipps Conservatory", "latitude": 40.439, "longitude": -79.946}
    ]

def get_estimated_time(**kwargs) -> str:
    return "20 minutes"

def calculate_walking_time(start: Dict[str, float] = None, end: Dict[str, float] = None, **kwargs) -> str:
    if not start or not end:
        return "Unknown time"
    lat_diff = abs(start["latitude"] - end["latitude"])
    lon_diff = abs(start["longitude"] - end["longitude"])
    distance = (lat_diff**2 + lon_diff**2)**0.5 * 111
    time_min = round((distance / 5) * 60)
    return f"{time_min} minutes"

def verify_image(**kwargs):
    return "valid"

def record_stats(**kwargs):
    return "Calories: 250, Steps: 4200"


# === AGENT SETUP ===

def create_agents(api_key):
    llm = GoogleGenAI(model="models/gemini-1.5-flash", api_key=api_key)

    tools = {
        "calendar": FunctionTool.from_defaults(fn=check_calendar, name="check_calendar"),
        "weather": FunctionTool.from_defaults(fn=check_weather, name="check_weather"),
        "time": FunctionTool.from_defaults(fn=check_time_of_day, name="check_time_of_day"),
        "location": FunctionTool.from_defaults(fn=get_current_location, name="get_current_location"),
        "landmark": FunctionTool.from_defaults(fn=get_landmark_location, name="get_landmark_location"),
        "walking_time": FunctionTool.from_defaults(fn=calculate_walking_time, name="calculate_walking_time"),
        "estimated_time": FunctionTool.from_defaults(fn=get_estimated_time, name="get_estimated_time"),
        "verify_image": FunctionTool.from_defaults(fn=verify_image, name="verify_image"),
        "record_stats": FunctionTool.from_defaults(fn=record_stats, name="record_stats"),
    }

    notification_agent = ReActAgent.from_tools(
        tools=[tools["calendar"], tools["weather"], tools["time"]],
        llm=llm,
        system_prompt="You are the NotificationAgent... Respond with ONLY 'Yes' or 'No'.",
        verbose=True
    )

    distance_agent = ReActAgent.from_tools(
        tools=[],
        llm=llm,
        system_prompt="You are the DistanceAgent... Return only a number in miles.",
        verbose=True
    )

    route_agent = ReActAgent.from_tools(
        tools=[tools["location"], tools["landmark"], tools["walking_time"], tools["estimated_time"]],
        llm=llm,
        system_prompt="You are the RouteAgent... Return a JSON with route data.",
        verbose=True
    )

    tracking_agent = ReActAgent.from_tools(
        tools=[],
        llm=llm,
        system_prompt="You are the TrackingAgent...",
        verbose=True
    )

    milestone_agent = ReActAgent.from_tools(
        tools=[],
        llm=llm,
        system_prompt="You are the VerifyMilestonesAgent...",
        verbose=True
    )

    return notification_agent, distance_agent, route_agent, tracking_agent, milestone_agent


# === EVENTS ===

class BeginProcessingEvent(Event):
    def __init__(self, bpe_output=""):
        super().__init__()
        self._bpe_output = bpe_output

    @property
    def bpe_output(self):
        return self._bpe_output

class NotificationEvent(Event):
    def __init__(self, ne_output=""):
        super().__init__()
        self._ne_output = ne_output

    @property
    def ne_output(self):
        return self._ne_output

class LandmarksEvent(Event):
    def __init__(self, le_output=""):
        super().__init__()
        self._le_output = le_output

    @property
    def le_output(self):
        return self._le_output

class TrackingEvent(Event):
    def __init__(self, te_output=""):
        super().__init__()
        self._te_output = te_output

    @property
    def te_output(self):
        return self._te_output

class VerifyPhotoEvent(Event):
    def __init__(self, ve_output=""):
        super().__init__()
        self._ve_output = ve_output

    @property
    def ve_output(self):
        return self._ve_output


# === WORKFLOW ===

class WalkWithScottyAppWorkflow(Workflow):
    @step
    async def setup(self, ev: StartEvent) -> BeginProcessingEvent:
        print(ev.first_input)
        self.when_to_send_notification_agent = ev.when_to_send_notification_agent
        self.determine_distance_to_walk_agent = ev.determine_distance_to_walk_agent
        self.determine_route_agent = ev.determine_route_agent
        self.track_user_agent = ev.track_user_agent
        self.verify_user_milestones_agent = ev.verify_user_milestones_agent

        self.db_utils = DBUtils()
        last_workout = self.db_utils.get_from_db_last_workout()
        return BeginProcessingEvent(bpe_output="Setup complete." if last_workout >= 2 else "Begin Processing.")

    @step
    async def BeginProcessing(self, ev: BeginProcessingEvent) -> NotificationEvent | BeginProcessingEvent:
        # Override agent behavior to always say Yes for testing
        return NotificationEvent(ne_output="Yes")

    @step
    async def CalculateGoalDistance(self, ctx: Context, ev: NotificationEvent) -> LandmarksEvent:
        result = self.determine_distance_to_walk_agent.chat("Can you please fetch the distance to walk. Return the distance in miles.")
        await ctx.set("distance_to_walk", result)
        return LandmarksEvent(le_output="tbd")

    @step
    async def DetermineRoute(self, ctx: Context, ev: LandmarksEvent) -> TrackingEvent:
        distance_to_walk = await ctx.get("distance_to_walk")

        # Call the route agent with a prompt to use tools for all fields except total time
        prompt = f"""
        You are a route planner agent. Use the available tools like `get_current_location` and `get_landmark_location`
        to generate a walking route for a user who wants to walk approximately {distance_to_walk} miles.

        Use the tools to:
        - Get the current GPS location of the user.
        - Get the coordinates of three landmarks: Posner Hall - CMU, Westinghouse memorial, and Phipps Conservatory.

        DO NOT calculate walking time using any tools. Instead, hardcode the estimated_total_time to 25.

        Return this JSON object only:
        {{
          "current-location": result_of_get_current_location,
          "landmarks_to_visit": ["Posner Hall - CMU", "Westinghouse memorial", "Phipps Conservatory"],
          "landmarks_location": result_of_get_landmark_location,
          "estimated_total_time": 25
        }}

        Respond with ONLY the JSON.
        """

        result = self.determine_route_agent.chat(prompt)
        response_text = str(result.response).strip()

        print("Route agent response received")
        await ctx.set("route_data", response_text)

        try:
            json_match = re.search(r'({[\s\S]*})', response_text)
            if json_match:
                json_str = json_match.group(1)
                route_data = json.loads(json_str)

                await ctx.set("route_data", route_data)

                route_description = f"Walking route planned: Starting from Cohon University Center, visiting {', '.join(route_data['landmarks_to_visit'])}. Total estimated time: {route_data['estimated_total_time']} minutes."

                return TrackingEvent(te_output=route_description)
            else:
                await ctx.set("route_error", "Could not extract JSON from agent response.")
                return TrackingEvent(te_output="Error processing route data")
        except Exception as e:
            await ctx.set("route_error", f"Error processing route data: {str(e)}")
            return TrackingEvent(te_output="Error processing route data")

    @step
    async def TrackRoute(self, ctx: Context, ev: TrackingEvent) -> VerifyPhotoEvent:
        print("Waiting for milestone 1")
        # await asyncio.sleep(0.5)
        print("Waiting for milestone 1")
        # await asyncio.sleep(0.5)
        print("Waiting for milestone 1")
        # await asyncio.sleep(0.5)
        print("Achieved!")
        print("Verify image step and Show Scotty through AR in the location")

        print("Waiting for milestone 2")
        # await asyncio.sleep(0.5)
        print("Waiting for milestone 2")
        # await asyncio.sleep(0.5)
        print("Waiting for milestone 2")
        # await asyncio.sleep(0.5)
        print("Not yet achieved")
        print("Detour, let's make the final path milestone 2, let's go there.")
        print("Milestone 2 reached")
        print("Verify Image Step")

        return VerifyPhotoEvent()

    @step
    async def VerifyPhoto(self, ctx: Context, ev: VerifyPhotoEvent) -> StopEvent | TrackingEvent:
        print("And finally populating DB for Calories Burned and Steps Walked today.")
        return StopEvent(result="Done All Steps")

    @step
    async def FinalStep(self, ev:TrackingEvent) -> StopEvent:
        return StopEvent(result="Done All Steps")


# === MAIN EXECUTION ===

async def main():
    gemini_api_key = os.getenv("API_KEY") 

    workflow = WalkWithScottyAppWorkflow(timeout=10, verbose=True)
    notification_agent, distance_agent, route_agent, tracking_agent, milestone_agent = create_agents(gemini_api_key)

    result = await workflow.run(
        first_input="Start the workflow.",
        when_to_send_notification_agent=notification_agent,
        determine_distance_to_walk_agent=distance_agent,
        determine_route_agent=route_agent,
        track_user_agent=tracking_agent,
        verify_user_milestones_agent=milestone_agent
    )
    print("Final Result:", result)


if __name__ == "__main__":
    asyncio.run(main())
