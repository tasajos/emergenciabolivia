import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FloatingButtonBar from './FloatingButtonBar';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';


// Define los tipos de tus rutas de navegación
type NavigationType = StackNavigationProp<any>; // Reemplaza 'any' con tu tipo de navegación si tienes uno



  
  // Define el tipo de las props basado en la navegación y la ruta
  type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Homev2'>;
  };

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergencias Bolivia</Text>
      <Image
        source={require('../imagenes/emblemabo.png')} // Asegúrate de que la ruta a la imagen es correcta
        style={styles.image}
      />
      <Text style={styles.subtitle}>Uniendo a los Equipos de Primera Respuesta de Bolivia</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Homev2')}// Asegúrate de tener configurada la navegación
      >
        <Text style={styles.buttonText}>INGRESAR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1EC0CB', // Ajusta este color para que coincida con tu diseño
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontFamily: 'Italic', // Asegúrate de que la fuente sea correcta
    fontWeight: 'bold',
    color: '#F6F5FA',
    marginBottom: 60, // Ajusta la separación según tu diseño
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center', // Asegúrate de que el texto esté centrado
    color: '#F6F5FA',
    marginTop: 20, // Ajusta la separación según tu diseño
    marginBottom: 60, // Ajusta la separación según tu diseño
  },
  image: {
    width: 150, // Ajusta esto según tu diseño
    height: 150, // Ajusta esto según tu diseño
    marginBottom: 20, // Ajusta la separación según tu diseño
  },
  button: {
    backgroundColor: '#5181B8', // Ajusta el color del botón según tu diseño
    borderRadius: 25, // Ajusta la curvatura de las esquinas según tu diseño
    padding: 10,
    paddingHorizontal: 30, // Ajusta el relleno horizontal para que el botón sea más ancho o más estrecho
    elevation: 2, // Añade sombra al botón en Android
  },
  buttonText: {
    fontSize: 18,
    color: 'white', // Ajusta el color del texto del botón para que coincida con el fondo de la pantalla
    textAlign: 'center',
  },
});

export default HomeScreen;