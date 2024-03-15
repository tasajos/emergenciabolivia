import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import MapView from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'unidadesepr'>;
// en un archivo llamado declarations.d.ts
declare module 'react-native-maps';

const UnidadesEPR: React.FC<Props> = ({ route }) => {
    // Destructuración aquí si 'route.params' es seguro de usar directamente,
    // de lo contrario, necesitarás comprobar si 'route.params' no es undefined antes de acceder a sus propiedades
    const { name, location } = route.params ?? { name: 'Default Name', location: { latitude: 0, longitude: 0 } };
 
  
    const handleCallPress = () => {
      // Por ejemplo, para iniciar una llamada
      Linking.openURL('tel:123456789');
    };

  // Aquí definimos el tipo para 'socialNetwork'
  const handleSocialPress = (socialNetwork: 'facebook' | 'twitter' | 'whatsapp') => {
    // Lógica para abrir la red social correspondiente
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Bomberos Voluntarios {name}</Text>
        <Image source={require('../imagenes/logos/yunka_atoq_log.png')} style={styles.logo} />
      </View>
      <MapView
  style={styles.map}
  initialRegion={{
    latitude: location?.latitude ?? 0, // Usar el operador de encadenamiento opcional y proporcionar un valor predeterminado
    longitude: location?.longitude ?? 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
/>
      {/* Aquí irían los botones de redes sociales */}
      <View style={styles.socialContainer}>
        {/* Ejemplo de botón para redes sociales */}
        <TouchableOpacity onPress={() => handleSocialPress('facebook')}>
          {/* Icono de Facebook */}
        </TouchableOpacity>
        {/* Agrega más botones para otras redes sociales */}
      </View>
      <TouchableOpacity style={styles.emergencyCallButton} onPress={handleCallPress}>
        <Text style={styles.emergencyCallText}>Llamada de Emergencia</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'blue', // Cambia este valor por el color que desees
  },
  headerText: {
    fontSize: 24,
    color: 'white', // Cambia este valor por el color que desees
  },
  logo: {
    height: 100,
    resizeMode: 'contain',
  },
  map: {
    height: 200, // Ajusta esto según tus necesidades
    width: '100%',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  emergencyCallButton: {
    alignItems: 'center',
    backgroundColor: 'red', // Cambia este valor por el color que desees
    padding: 10,
    margin: 20,
    borderRadius: 5,
  },
  emergencyCallText: {
    color: 'white', // Cambia este valor por el color que desees
    fontSize: 18,
  },
  // ... añade los estilos para los botones de redes sociales ...
});

export default UnidadesEPR;
