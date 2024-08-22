import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationPermissionModal = ({ isVisible, onClose }) => {
  const openAppNotificationSettings = () => {
    Linking.openSettings(); // Redirigir a la configuración de la app en Android
  };

  const requestPermission = async () => {
    const permission = await messaging().requestPermission();
    onClose(); // Cierra el modal después de solicitar el permiso.

    if (
      permission === messaging.AuthorizationStatus.AUTHORIZED ||
      permission === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      console.log('Permiso de notificación concedido.');
      openAppNotificationSettings(); // Redirigir a la configuración de la aplicación.
    } else {
      console.log('Permiso de notificación denegado.');
      openAppNotificationSettings(); // Redirigir a la configuración de la aplicación.
    }
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.modalContent}>
        <Icon name="notifications" size={50} color="#FF9500" />
        <Text style={styles.title}>Habilitar Notificaciones</Text>
        <Text style={styles.message}>
          ¿Deseas habilitar las notificaciones para recibir las últimas alertas y actualizaciones? Estas son necesarias para que estés informado de las emergencias.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={requestPermission}>
            <Text style={styles.buttonText}>Sí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const NotificationPermission = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const checkNotificationPermission = async () => {
      const hasSeenModal = await AsyncStorage.getItem('hasSeenNotificationModal');
      if (!hasSeenModal) {
        setIsModalVisible(true);
      }
    };

    checkNotificationPermission();
  }, []);

  const handleCloseModal = async () => {
    setIsModalVisible(false);
    await AsyncStorage.setItem('hasSeenNotificationModal', 'true');
  };

  return (
    <NotificationPermissionModal
      isVisible={isModalVisible}
      onClose={handleCloseModal}
    />
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    marginVertical: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#5cb85c',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default NotificationPermission;