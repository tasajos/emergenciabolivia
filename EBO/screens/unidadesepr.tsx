import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import MapView from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import FloatingButtonBar from './FloatingButtonBar';
import { Unidad } from './types';


import facebookIcon from '../imagenes/redessociales/facebook.png';
import webIcon from '../imagenes/redessociales/red-mundial.png';

type Props = NativeStackScreenProps<RootStackParamList, 'unidadesepr'>;



const UnidadesEPR: React.FC<Props> = ({ route, navigation }) => {
  const { unidad } = route.params ?? { unidad: { name: 'Nombre por defecto', image: { uri: 'ruta por defecto' } } };

  const handleCallPress = () => {
    Linking.openURL('tel:70776212');
  };

  const handleFacebookPress = () => {
    Linking.openURL('https://www.facebook.com/yunkabo');
  };

  const handleWebPress = () => {
    Linking.openURL('https://www.yunkaatoq.org');
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Bomberos Voluntarios {unidad.name}</Text>
          {/* Comprobar si la URI de la imagen existe antes de intentar cargar la imagen */}
          {unidad.image && unidad.image.uri ? (
            <Image source={{ uri: unidad.image.uri }} style={styles.logo} />
          ) : (
            // Cargar una imagen predeterminada si la URI no está disponible
            <Image source={require('../imagenes/emblema.png')} style={styles.logo} />
          )}
        </View>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -17.413977,
            longitude: -66.165322,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        <TouchableOpacity style={styles.emergencyCallButton} onPress={handleCallPress}>
          <Text style={styles.emergencyCallText}>Llamada de Emergencia</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleFacebookPress}>
            <Image source={facebookIcon} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleWebPress}>
            <Image source={webIcon} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <FloatingButtonBar navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'blue',
  },
  headerText: {
    fontSize: 24,
    color: 'white',
  },
  logo: {
    height: 100,
    resizeMode: 'contain',
  },
  map: {
    height: 200,
    width: '100%',
  },
  emergencyCallButton: {
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    margin: 20,
    borderRadius: 5,
  },
  emergencyCallText: {
    color: 'white',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default UnidadesEPR;
