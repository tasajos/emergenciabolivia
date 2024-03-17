// Kitset.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import database from '@react-native-firebase/database';

// Define el tipo para tus kits de emergencia
type Kit = {
  key: string;
  Imagen: string;
  Tipo: string;
};

const kitset = () => {
  const [kits, setKits] = useState<Kit[]>([]);

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
    <View style={styles.container}>
      {/* Aquí puedes agregar el resto de tu UI, como encabezado, etc. */}
      <FlatList
        data={kits}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.kitItem}>
            <Image source={{ uri: item.Imagen }} style={styles.kitIcon} />
            {/* Agrega aquí más información si es necesario */}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // ... Tus estilos aquí
  },
  kitItem: {
    // ... Tus estilos para cada item aquí
  },
  kitIcon: {
    width: 100, // Modifica según tu diseño
    height: 100, // Modifica según tu diseño
    // ... Otros estilos para el icono aquí
  },
  // ... Agrega más estilos según sea necesario
});

export default kitset;
