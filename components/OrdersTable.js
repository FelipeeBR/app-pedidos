import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

const OrdersTable = ({ orders, onEdit, onDelete }) => {
    const confirmDelete = (orderId) => {
        Alert.alert(
        'Confirmar Exclusão',
        'Tem certeza que deseja excluir este pedido?',
        [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Excluir', onPress: () => onDelete(orderId) }
        ]
        );
    };

  return (
    <ScrollView horizontal={true} style={styles.container}>
      <View>
          <View style={[styles.row, styles.header]}>
          <Text style={[styles.cell, styles.headerText, styles.smallColumn]}>ID</Text>
          <Text style={[styles.cell, styles.headerText, styles.mediumColumn]}>Nome do Cliente</Text>
          <Text style={[styles.cell, styles.headerText, styles.mediumColumn]}>Data do pedido</Text>
          <Text style={[styles.cell, styles.headerText, styles.mediumColumn]}>Data de entrega</Text>
          <Text style={[styles.cell, styles.headerText, styles.smallColumn]}>Status</Text>
          <Text style={[styles.cell, styles.headerText, styles.smallColumn]}>Ações</Text>
          </View>

          {orders.map(order => (
          <View key={order.id} style={[styles.row, styles.bodyRow]}>
            <Text style={[styles.cell, styles.smallColumn]}>{order.id}</Text>
            <Text style={[styles.cell, styles.mediumColumn]}>{order.customer_name}</Text>
            <Text style={[styles.cell, styles.mediumColumn]}>
              {new Date(order.order_date).toLocaleDateString()}
            </Text>
            <Text style={[styles.cell, styles.mediumColumn]}>
              {new Date(order.delivery_date).toLocaleDateString()}
            </Text>
            <Text style={[styles.cell, styles.smallColumn, 
              {color: getStatusColor(order.status)}]}>
              {order.status}
            </Text>
            <View style={[styles.cell, styles.actionsColumn]}>
              <TouchableOpacity 
                onPress={() => onEdit(order)}
                style={[styles.actionButton, styles.editButton]}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => confirmDelete(order.id)}
                style={[styles.actionButton, styles.deleteButton]}
              >
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
          ))}
      </View>
    </ScrollView>
  );
};

const getStatusColor = (status) => {
  switch(status.toLowerCase()) {
    case 'pending': return '#FF9800';
    case 'delivered': return '#4CAF50';
    case 'cancelled': return '#F44336';
    default: return '#607D8B';
  }
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    backgroundColor: 'white'
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  header: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
  },
  bodyRow: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cell: {
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#424242',
  },
  smallColumn: {
    width: 80,
  },
  mediumColumn: {
    width: 120,
  },
  actionsColumn: {
    width: 160, 
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default OrdersTable;