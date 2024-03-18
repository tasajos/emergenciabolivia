// Kitset.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import FloatingButtonBar from './FloatingButtonBar';
// Define el tipo para tus kits de emergencia
type Kit = {
  key: string;
  Imagen: string;
  Tipo: string;
};

type RootStackParamList = {
    // ... otros parámetros de tus rutas
    Kitset: undefined; // Asegúrate de tener una ruta Kitset en tu StackNavigator
  };
const Kitset = () => {
  const [kits, setKits] = useState<Kit[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const ref = database().ref('/kitsemergencia');
    ref.on('value', (snapshot) => {
      const data = snapshot.val();
      const kitsList = Object.keys(data).map(key => ({
        key: key,
        ...data[key]
      }));
      setKits(kitsList);
    });

    return () => ref.off(); // Desuscribirse del listener al desmontar el componente
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
        <Image source={require('../imagenes/tsflo1.png')} style={styles.logo} />
        <Text style={styles.headerText}>Con el Apoyo de Tunari sin Fuego</Text>
      </View>
      <FlatList
        data={kits}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.kitItem}>
            <Image source={{ uri: item.Imagen }} style={styles.kitIcon} />
            <Text style={styles.kitText}>{`Kit ${item.Tipo}`}</Text>
          </TouchableOpacity>
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
      <FloatingButtonBar navigation={navigation} />
    </SafeAreaView>
    
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Suponiendo que el fondo es blanco
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerImage: {
    width: '80%',
    height: 60, // Altura de tu curva
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 16,
    //fontWeight: 'bold',
    color: '#424242',
    marginTop: 20, // Ajustar según tu diseño
  },
  kitItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    height: 150, // Ajustar según tu diseño
  },
  kitIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  kitText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  logo: {
    height: 50, // Ajusta la altura de tu logo
    resizeMode: 'contain', // Contiene la imagen dentro del espacio disponible sin deformarla
    marginTop: 20, // Ajusta el margen superior si es necesario
  },
  // ... Agrega más estilos según sea necesario
});

export default Kitset;