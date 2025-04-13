import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const STORAGE_KEY = '@WalkWithScotty:user';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Comprobar si hay un usuario logueado al cargar la pantalla
    const checkLoggedIn = async () => {
      const user = await AsyncStorage.getItem(STORAGE_KEY);
      if (user) {
        router.replace('/'); // Redirigir al home si ya está logueado
      }
    };

    checkLoggedIn();
  }, []);

  const handleLogin = async () => {
    if (email && password) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ email }));
      router.replace('/');
    } else {
      Alert.alert('Error', 'Por favor, introduce tu email y contraseña.');
    }
  };

  const handleSignUp = () => {
    Alert.alert('Registro', 'La funcionalidad de registro aún no está implementada en esta versión básica.');
    // Aquí iría la lógica para navegar a la pantalla de registro
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Log In' }} />
      <ThemedText type="title" style={styles.title}>Iniciar Sesión</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Sign Up" onPress={handleSignUp} color="grey" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});