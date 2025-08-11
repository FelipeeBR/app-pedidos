import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Button } from 'react-native';

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
            <Text style={[styles.cell, styles.headerText, styles.mediumColumn]}>Cliente</Text>
            <Text style={[styles.cell, styles.headerText, styles.mediumColumn]}>Data</Text>
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
                <Text style={[styles.cell, styles.smallColumn, 
                            {color: getStatusColor(order.status)}]}>
                {order.status}
                </Text>
                <View style={[styles.cell, styles.smallColumn, styles.actionsCell]}>
                <TouchableOpacity 
                    onPress={() => onEdit(order)}
                    style={styles.actionButton}
                >
                    <Button title="Editar" />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => confirmDelete(order.id)}
                    style={styles.actionButton}
                >
                    <Button title="Excluir"  />
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
    case 'pendente': return '#FF9800';
    case 'concluído': return '#4CAF50';
    case 'cancelado': return '#F44336';
    default: return '#607D8B';
  }
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
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
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    padding: 5,
  },
});

export default OrdersTable;