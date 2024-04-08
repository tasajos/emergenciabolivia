// FloatingButtonBar.tsx
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Linking ,Alert} from 'react-native';
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
            <View style={styles.whatsAppContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('ReporteEmergencia')}>
          <Image source={require('../imagenes/alerta64.png')} style={styles.alertIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openWhatsApp}>
          <Image source={require('../imagenes/whatsapp32.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Contacto')}>
        <Image source={require('../imagenes/add32.png')} style={styles.icon} />
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
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  icon: {
    width: 30,
    height: 30,
  },
  whatsAppContainer: {
    alignItems: 'center',
    
    //marginBottom: 5,
    
  },
  alertIcon: {
    width: 30,
    height: 30,
    marginBottom: 15,  // Espacio entre los botones
    //backgroundColor: 'darkblue',
    
  },
});

export default FloatingButtonBar;