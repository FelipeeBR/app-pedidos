import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import OrdersTable from '../components/OrdersTable';
import axios from "axios";

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [userToken, setUserToken] = useState(null);
  const [orders, setOrders] = useState([]);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    navigation.navigate('Login');
  };

  const handleEdit = (order) => {
    console.log('Editar pedido:', order);
  };

  const handleDelete = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
    console.log('Excluir pedido ID:', orderId);
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('token');
      setUserToken(token);
      if(!token) {
        navigation.navigate('Login');
      }
    };
    
    checkToken();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
        if(!userToken) return;
        try {
            const res = await axios.get('http://192.168.1.109:80/api/v1/orders', { 
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
            });
            setOrders(res.data.orders);
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
        }
    };
    fetchOrders();
  }, [userToken]);

  if(!userToken) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo</Text>
      <Button title="Sair" onPress={handleLogout} />

      <View style={{ flex: 1, padding: 16 }}>
        <OrdersTable 
          orders={orders} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </View>
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