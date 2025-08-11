import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import OrdersTable from '../components/OrdersTable';
import axios from "axios";

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [userToken, setUserToken] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);


  const [customerName, setCustomerName] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [status, setStatus] = useState('');

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    navigation.navigate('Login');
  };

  const handleEdit = (order) => {
    setModalVisible(!isModalVisible);
    setCustomerName(order.customer_name);
    setOrderDate(order.order_date);
    setDeliveryDate(order.delivery_date);
    setStatus(order.status);
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
      <View>
        <Modal isVisible={isModalVisible} style={styles.centeredView}>
          <View style={styles.modal}>
            <Text style={styles.title}>Editar Pedido</Text>     
            <ScrollView>
              <Text>Cliente</Text>
              <TextInput
                style={styles.input}
                placeholder="Cliente"
                value={customerName}
                onChangeText={setCustomerName}
                autoCapitalize="none"
              />

              <Text>Data do pedido</Text>
              <TextInput
                style={styles.input}
                placeholder="Data do pedido"
                value={orderDate}
                onChangeText={setOrderDate}
                autoCapitalize="none"
              />

              <Text>Data de entrega</Text>
              <TextInput
                style={styles.input}
                placeholder="Data de entrega"
                value={deliveryDate}
                onChangeText={setDeliveryDate}
                autoCapitalize="none"
              />

              <Text>Status</Text>
              <TextInput
                style={styles.input}
                placeholder="Status"
                value={status}
                onChangeText={setStatus}
                autoCapitalize="none"
              />
            </ScrollView>
            <View style={styles.modal_align}>
              <TouchableOpacity onPress={() => handleEdit} style={styles.button_modal}>
                <Text style={{ color: 'white' }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',  
    maxHeight: '50%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modal_align: {
    flexDirection: 'row', 
    justifyContent: 'flex-end',
  },
  button_modal: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
});

export default DashboardScreen;