// FloatingButtonAdmin.tsx
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Linking ,Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';


type NavigationType = StackNavigationProp<any>;

type Props = {
  navigation: NavigationProp<ParamListBase>;
};

const openWhatsApp = () => {
  // Reemplaza con tu número de teléfono en formato internacional sin '+' ni '00'
  let phoneNumber = '59170776212';

  let message = 'Administrador, ayudame con.'; // Mensaje que deseas enviar
  
  // Codifica el mensaje para que sea una URL válida
  let encodedMessage = encodeURIComponent(message);
  
  // Abre WhatsApp directamente con el número y el mensaje especificado
  let url = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
  
  Linking.openURL(url).catch((err) => {
    console.error('An error occurred', err);
    Alert.alert('Error', 'No se puede abrir WhatsApp, asegúrate de que está instalado en tu dispositivo.');
  });;
};

const FloatingButtonAdmin = () => {
  const navigation = useNavigation();  // Usando el hook useNavigation
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Uiadministrador')}>
        <Image source={require('../imagenes/hogar1.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Homev2')}>
        <Image source={require('../imagenes/bloqueado.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={openWhatsApp}>
        <Image source={require('../imagenes/whatsapp24.png')} style={styles.icon} />
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

export default FloatingButtonAdmin;