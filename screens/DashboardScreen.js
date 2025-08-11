import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
  const [userToken, setUserToken] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('token');
      setUserToken(token);
      
      if (!token) {
        navigation.navigate('Login');
      }
    };
    
    checkToken();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    navigation.navigate('Login');
  };

  if (!userToken) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo à tela autenticada!</Text>
      <Text style={styles.token}>Seu token: {userToken}</Text>
      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  token: {
    marginBottom: 20,
    color: 'gray',
  },
});

export default DashboardScreen;