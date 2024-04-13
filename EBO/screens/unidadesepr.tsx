import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { RootStackParamList } from '../App';
import FloatingButtonBar from './FloatingButtonBar';
import { Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'; // Cambiado de createNativeStackNavigator a createStackNavigator
import { StackScreenProps } from '@react-navigation/stack';
import 'react-native-gesture-handler';

const Stack = createStackNavigator<RootStackParamList>();
type Props = StackScreenProps<RootStackParamList, 'unidadesepr'>; // Cambiado de NativeStackScreenProps a StackScreenProps




const UnidadesEPR: React.FC<Props> = ({ route, navigation }) => {
  const { unidad } = route.params ?? {
    unidad: {
      name: 'Nombre por defecto', 
      image: { uri: 'ruta por defecto' },
      telefono: '70776212',
      facebook: 'https://www.facebook.com/yunkabo',
      web: 'https://www.yunkaatoq.org',
      latitude: null, // Simulando datos incompletos
      longitude: null,
      ciudad: 'Nombre de la Ciudad'
    }
  };

  // Verificar si las coordenadas son válidas
  const latitude = unidad.latitude ?? 0;
  const longitude = unidad.longitude ?? 0;
  const isValidLocation = (unidad.latitude != null) && (unidad.longitude != null);


  // Imprimir la URI de la imagen en la consola
  console.log("URI de la imagen:", unidad.image.uri);
  console.log("Datos de la unidad:", unidad);

  const handleCallPress = () => {
    Linking.openURL(`tel:${unidad.telefono}`);
  };

  const handleFacebookPress = () => {
    if (unidad.facebook) {
    Linking.openURL(unidad.facebook);
  } else {
    // Manejar el caso en que el enlace de Facebook no esté defini
    console.log("El enlace de Facebook no está disponible");
    Alert.alert('Enlace no disponible', 'Esta unidad no cuenta con facebook');
  }

  };

  const handleWebPress = () => {

    if (unidad.web) {
    Linking.openURL(unidad.web);
  } else {
    // Manejar el caso en que el enlace web no esté definido
    console.log("El enlace web no está disponible");
    Alert.alert('Enlace no disponible', 'El enlace web no está disponible para esta unidad.');
  }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Bomberos Voluntarios {unidad.name}</Text>
          <Image source={{ uri: unidad.image.uri }} style={styles.logo} />
          <Text style={styles.cityText}>{unidad.ciudad}</Text>
        </View>
        {isValidLocation ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{
                latitude: latitude,
                longitude: longitude
              }}
              title={`Bomberos Voluntarios ${unidad.name}`}
              description={`Teléfono: ${unidad.telefono}`}
            />
          </MapView>
        ) : (
          <View style={[styles.map, styles.center]}>
            <Text>No hay datos de ubicación disponibles para mostrar el mapa.</Text>
          </View>
        )}
        <TouchableOpacity style={styles.emergencyCallButton} onPress={handleCallPress}>
          <Text style={styles.emergencyCallText}>Llamada de Emergencia</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleFacebookPress} style={styles.imageButton}>
            <Image source={require('../imagenes/redessociales/facebook128.png')} style={styles.iconImage} />
            <Text>Visita Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleWebPress} style={styles.imageButton}>
            <Image source={require('../imagenes/redessociales/red-mundial128.png')} style={styles.iconImage} />
            <Text>Visita la Web</Text>
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
    padding: 5,
   backgroundColor: '#56BBCF',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    color: 'black',
  },
  logo: {
    width: 100, // Tamaño fijo para la imagen
    height: 100,
    resizeMode: 'contain', // Ajustar la imagen dentro del contenedor
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
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  imageButton: {
    alignItems: 'center',
    //justifyContent: 'center',
    width: 100,
    marginHorizontal: 5,
    
  },
  iconImage: {
    width: 40, // Ajusta según el tamaño de tus imágenes
    height: 40, // Ajusta según el tamaño de tus imágenes
    
  },
  cityText: {
    fontSize: 18,
    color: 'black', // O el color que prefieras
    marginTop: 5, // Ajusta el espacio sobre el nombre de la ciudad
  },
});

export default UnidadesEPR;
