import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, PermissionsAndroid, Alert, Linking } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';

// MEJORA: Creamos una función que "convierte" Geolocation.getCurrentPosition a una Promesa.
// Esto nos permite usarlo fácilmente con async/await.
const getCurrentPosition = (): Promise<Geolocation.Position> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  });
};


const AlertaWhatsAppScreen = () => {
  const [statusMessage, setStatusMessage] = useState('Iniciando alerta...');
  const navigation = useNavigation();

  useEffect(() => {
    // MEJORA: Toda la lógica ahora está en una única cadena de async/await
    // lo que permite que un solo try/catch maneje todos los errores.
    const sendEmergencyAlert = async () => {
      try {
        // 1. Solicitar permiso de ubicación
        setStatusMessage('Solicitando permiso de ubicación...');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permiso de Ubicación",
            message: "Necesitamos tu ubicación para enviar la alerta de emergencia.",
            buttonPositive: "Aceptar"
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          // Si el permiso es denegado, lanzamos un error que será atrapado abajo.
          throw new Error("Permiso de ubicación denegado. No se puede enviar la alerta.");
        }

        // 2. Obtener la ubicación del usuario
        setStatusMessage('Obteniendo ubicación exacta...');
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        const locationLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        
        // 3. Obtener el número de WhatsApp desde Firebase
        setStatusMessage('Contactando centro de emergencias...');
        const phoneSnapshot = await database().ref('/whatsappnroapp').once('value');
        const phoneNumber = phoneSnapshot.val();

        if (!phoneNumber) {
          throw new Error('Número de WhatsApp para emergencias no configurado.');
        }

        // 4. Preparar y enviar el mensaje
        const message = `*¡¡EMERGENCIA!!*\nEsto es una emergencia, por favor, apoyo inmediato.\n\nMi ubicación es:\n${locationLink}`;
        const url = `whatsapp://send?phone=591${phoneNumber}&text=${encodeURIComponent(message)}`;

        const canOpen = await Linking.canOpenURL(url);
        if (!canOpen) {
            // Este error ahora será atrapado por el bloque catch de abajo.
            throw new Error('WhatsApp no está instalado en este dispositivo.');
        }

        await Linking.openURL(url);
        
        // 5. Regresar a la pantalla anterior después de abrir WhatsApp
        navigation.goBack();

      } catch (error: any) {
        // ¡Este bloque ahora atrapará CUALQUIER error que ocurra en el proceso!
        Alert.alert("Error en la Alerta", error.message);
        navigation.goBack();
      }
    };

    sendEmergencyAlert();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#c9302c" />
      <Text style={styles.statusText}>{statusMessage}</Text>
      <Text style={styles.warningText}>No cierres la aplicación.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  statusText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  warningText: {
    marginTop: 8,
    fontSize: 14,
    color: 'grey',
  },
});

export default AlertaWhatsAppScreen;