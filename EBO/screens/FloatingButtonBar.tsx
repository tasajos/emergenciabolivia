import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, Linking, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type NavigationType = StackNavigationProp<any>;

type Props = {
  navigation: NavigationType;
};

const openWhatsApp = () => {
  let phoneNumber = '59170776212';
  let message = 'Hola, me gustaría obtener más información.';
  let encodedMessage = encodeURIComponent(message);
  let url = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
  
  Linking.openURL(url).catch((err) => {
    console.error('An error occurred', err);
    Alert.alert('No se puede abrir WhatsApp, asegúrate de que está instalado en tu dispositivo.');
  });
};

const FloatingButtonBar: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Homev2')}>
        <Image source={require('../imagenes/hogar32.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Ubicacionesbom')}>
        <Image source={require('../imagenes/mapa32.png')} style={styles.icon} />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('ReporteEmergencia')} style={styles.alertContainer}>
        <Image source={require('../imagenes/alerta64.png')} style={styles.alertIcon} />
        <Text style={styles.alertText}>Reportar Emergencia</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={openWhatsApp}>
        <Image source={require('../imagenes/whatsapp32.png')} style={styles.icon} />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Image source={require('../imagenes/acceso.png')} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  icon: {
    width: 30,
    height: 30,
  },
  alertContainer: {
    alignItems: 'center',
  },
  alertIcon: {
    width: 30,
    height: 30,
  },
  alertText: {
    marginTop: 5,
    fontSize: 12,
    color: 'black',
  },
});

export default FloatingButtonBar;