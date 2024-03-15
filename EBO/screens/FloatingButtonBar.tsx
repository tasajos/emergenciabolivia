// FloatingButtonBar.tsx
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Linking } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type NavigationType = StackNavigationProp<any>;

type Props = {
  navigation: NavigationType;
};

const openWhatsApp = () => {
  // Reemplaza con tu número de teléfono en formato internacional sin '+' ni '00'
  let phoneNumber = '59170776212';

  let message = 'Hola, me gustaría obtener más información.'; // Mensaje que deseas enviar
  
  // Codifica el mensaje para que sea una URL válida
  let encodedMessage = encodeURIComponent(message);
  
  // Abre WhatsApp directamente con el número y el mensaje especificado
  let url = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
  
  Linking.openURL(url).catch((err) => {
    console.error('An error occurred', err);
    alert('No se puede abrir WhatsApp, asegúrate de que está instalado en tu dispositivo.');
  });
};

const FloatingButtonBar: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('MenuInicio')}>
        <Image source={require('../imagenes/hogar1.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MapScreen')}>
        <Image source={require('../imagenes/mapabo1.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={openWhatsApp}>
        <Image source={require('../imagenes/whatsapp24.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
        <Image source={require('../imagenes/add24.png')} style={styles.icon} />
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
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default FloatingButtonBar;