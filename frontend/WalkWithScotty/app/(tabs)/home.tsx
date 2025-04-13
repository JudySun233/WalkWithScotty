import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
// import { useAuth } from '../contexts/AuthContext'; //  Adjust the path if necessary.  You'll need to set this up.
// import { useDatabase } from '../contexts/DatabaseContext'; // Adjust the path if necessary. You'll need to set this up.
import { Colors } from '@/constants/Colors'; //  Adjust the path if necessary
import { IconSymbol } from '@/components/ui/IconSymbol'; // Adjust the path if necessary

// Mock data for demonstration purposes.  Replace with actual data fetching.
const mockDogData = {
    dog_state: 'neutral', //  'happy', 'neutral', or 'sad'
};

const mockWalkData = [
    { date: '2024-07-24', minutes: 30, calories: 150, points: 30 },
    { date: '2024-07-25', minutes: 45, calories: 220, points: 45 },
    { date: '2024-07-26', minutes: 60, calories: 300, points: 60 },
    { date: '2024-07-27', minutes: 20, calories: 100, points: 20 },
    { date: '2024-07-28', minutes: 50, calories: 250, points: 50 },
    { date: '2024-07-29', minutes: 70, calories: 350, points: 70 },
    { date: '2024-07-30', minutes: 25, calories: 120, points: 25 },
];

// Image sources -  Make sure these paths are correct, and the images exist!
const dogImages = {
   //  happy: require('./assets/happy_dog.png'), //  Replace with your actual image paths
    neutral: require('../../assets/images/neutral_dog.jpg'),
   //  sad: require('./assets/sad_dog.png'),
};

const HomeScreen = () => {
    // const { isLoggedIn } = useAuth(); //  Replace with your actual auth hook
    // const { getDogData, getWalkHistory } = useDatabase(); // Replace with your database hooks
    const [dogState, setDogState] = useState<string>('neutral'); //  'happy', 'neutral', or 'sad'
    const [walkHistory, setWalkHistory] = useState<any[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(true); // REMOVE THIS LINE.  FOR DEMO PURPOSES ONLY.


    useEffect(() => {
        // Fetch data (replace with your actual data fetching logic)
        // const dogData = getDogData();
        // const history = getWalkHistory();

        // if (dogData) {
        setDogState(mockDogData.dog_state); //  Replace with actual data
        // }
        // if (history) {
        setWalkHistory(mockWalkData); // Replace with actual data
        // }
    }, []);



    const getDogImage = (state: string) => {
        switch (state) {
            // case 'happy': return dogImages.happy;
            case 'neutral': return dogImages.neutral;
            // case 'sad': return dogImages.sad;
            default: return dogImages.neutral;
        }
    };

    const dogMessage = () => {
        switch (dogState) {
            case 'neutral':
                return "I need a walk, woof";
            case 'sad':
                return "I REALLY need a walk, woof";
            default:
                return "";
        }
    };

    return (
        <View style={styles.container}>
            {/* Dog Avatar and Message */}
            <View style={styles.dogContainer}>
                <Image
                    source={getDogImage(dogState)}
                    style={{
                        width: 200,
                        height: 200,
                        resizeMode: 'contain',

                    }}
                />
                {dogMessage() && (
                    <View style={styles.messageBubble}>
                        <Text style={styles.messageText}>{dogMessage()}</Text>
                    </View>
                )}
            </View>

            {/* Weekly Activity History */}
            <View style={styles.historyContainer}>
                <Text style={styles.historyTitle}>Your Weekly Activity</Text>
                {walkHistory.length > 0 ? (
                    walkHistory.map((day, index) => (
                        <View key={index} style={styles.historyItem}>
                            <Text style={styles.historyDate}>{day.date}</Text>
                            <View style={styles.activityContainer}>
                                <View style={styles.activityItem}>
                                    <IconSymbol name="clock" size={16} color={Colors.gray} />
                                    <Text style={styles.activityText}>{day.minutes} min</Text>
                                </View>
                                <View style={styles.activityItem}>
                                    <IconSymbol name="flame" size={16} color={Colors.red} />
                                    <Text style={styles.activityText}>{day.calories} cal</Text>
                                </View>
                                <View style={styles.activityItem}>
                                    <IconSymbol name="star" size={16} color={Colors.yellow} />
                                    <Text style={styles.activityText}>{day.points} pts</Text>
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noHistoryText}>No activity recorded this week.</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', // Center content vertically
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    notLoggedInText: {
        fontSize: 18,
        color: Colors.gray,
    },
    dogContainer: {
        alignItems: 'center',
        marginBottom: 40,
        position: 'relative', //  Needed for absolute positioning of the message bubble
    },
    messageBubble: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        position: 'absolute',
        top: -20,
        right: -30,
        shadowColor: Colors.black,
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        maxWidth: 200,

    },
    messageText: {
        fontSize: 14,
        color: Colors.text,
    },
    historyContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: Colors.white,
        borderRadius: 10,
        shadowColor: Colors.black,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
    },
    historyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.text,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        paddingBottom: 10,
    },
    historyDate: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    activityContainer: {
        flexDirection: 'row',
        gap: 15
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    activityText: {
        fontSize: 14,
        color: Colors.dark,
    },
    noHistoryText: {
        fontSize: 16,
        color: Colors.dark,
        textAlign: 'center'
    },
});

export default HomeScreen;
