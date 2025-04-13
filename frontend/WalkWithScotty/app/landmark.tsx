import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions, // To get screen dimensions
} from 'react-native';
import { Link } from 'expo-router';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

/**
 * FullScreenImageView Component
 *
 * Displays an image that fills the entire screen.
 */
const Start = () => {
   return (
      <View style={styles.container}>
         <Link href="/accomplishments">
               <Image
                  source={require('./../assets/images/landmark.png')}
                  style={styles.image}
                  resizeMode="cover"
               />
         </Link>
      </View>
  );
};

// Define the styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up all available space
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    backgroundColor: '#000', // Optional: background color while image loads or if it doesn't cover fully
  },
  image: {
    width: width, // Set image width to screen width
    height: height, // Set image height to screen height
  },
});

export default Start; // Export the component for use in your app
