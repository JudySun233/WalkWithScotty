import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Setup = ({ navigation }) => {
    const [name, setName] = useState('');
    const [size, setSize] = useState('Small');
    const [color, setColor] = useState('#8c6239'); // Default to Brown
    const [breed, setBreed] = useState('Scottish terrier');
    const [error, setError] = useState('');

    const handleConfirm = () => {
        if (!name.trim()) {
            setError('Please enter a name for your pet.');
            return;
        }
        if (!/^[a-zA-Z]+$/.test(name)) {
            setError('Name must contain only alphabetic characters.');
            return;
        }
        setError(''); // Clear any previous error

        // In a real app, you'd save this data (e.g., using AsyncStorage, Redux, or a context)
        const petData = {
            name,
            size,
            color,
            breed,
        };
    };

    const colorOptions = [
        { label: 'Brown', value: '#8c6239' },
        { label: 'Beige', value: '#f9f3b9' },
        { label: 'White', value: '#ffffff' },
        { label: 'Black', value: '#000000' },
        { label: 'Grey', value: '#f0f0f0' },
        { label: 'Golden', value: '#e5cd6c' },
        { label: 'Caramel', value: '#ae6427' },
    ];

    const breedOptions = [
        'Scottish terrier',
        'French bulldog',
        'Labrador retriever',
        'Golden retriever',
        'German shepherd',
        'Poodles',
        'Shiba Inu',
    ];

    const sizeOptions = ['Small', 'Medium', 'Large'];


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Set Up Your Virtual Pet</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter pet name"
                    placeholderTextColor="#ccc"
                />
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Size:</Text>
              <Picker
                selectedValue={size}
                onValueChange={(itemValue, itemIndex) => setSize(itemValue)}
                style={styles.picker}
                >
                {sizeOptions.map((option) => (
                    <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Color:</Text>
                <Picker
                  selectedValue={color}
                  onValueChange={(itemValue, itemIndex) =>
                    setColor(itemValue)
                  }
                  style={styles.picker}
                >
                  {colorOptions.map((c) => (
                    <Picker.Item key={c.value} label={c.label} value={c.value} />
                  ))}
                </Picker>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Breed:</Text>
                <Picker
                    selectedValue={breed}
                    onValueChange={(itemValue, itemIndex) => setBreed(itemValue)}
                    style={styles.picker}
                >
                    {breedOptions.map((b) => (
                        <Picker.Item key={b} label={b} value={b} />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#555',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#333',
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        color: '#333',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

export default Setup;
