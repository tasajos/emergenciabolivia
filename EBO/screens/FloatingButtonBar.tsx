// FloatingButtonBar.tsx
import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type NavigationType = StackNavigationProp<any>; // Reemplaza 'any' con tu tipo de navegación si tienes uno

type Props = {
  navigation: NavigationType;
};

const FloatingButtonBar: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
        <Image source={require('../imagenes/hogar1.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MapScreen')}>
        <Image source={require('../imagenes/mapabo1.png')} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')}>
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
    backgroundColor: 'transparent', // O el color de fondo que prefieras
  },
  icon: {
    width: 30,
    height: 30,
  },
  // Agrega estilos adicionales si es necesario
});

export default FloatingButtonBar;
