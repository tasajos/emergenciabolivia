import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';


const DetailsScreen = () => {

    const [searchQuery, setSearchQuery] = useState('');

    const clearSearch = () => {
      setSearchQuery('');
    };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.supportSection}>
        <Image source={require('../imagenes/tsflo1.png')} style={styles.logo} />
        <Text style={styles.supportText}>Con el Apoyo de Tunari sin Fuego</Text>
      </View>
      <View style={styles.searchSection}>
        <Image
          source={require('../imagenes/lupa.png')} // Asegúrate de tener un icono de búsqueda
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar una unidad"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#000"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Image
              source={require('../imagenes/cerrars.png')} // Asegúrate de tener un icono de cierre
              style={styles.clearIcon}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.categoryContainer}>
        {/* Icon Buttons */}
        <TouchableOpacity style={styles.iconButton}>
          {/* ... */}
        </TouchableOpacity>
        {/* Repetir para cada categoría */}
      </View>
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Información Útil</Text>
        <TouchableOpacity style={styles.infoButton}>
          {/* ... */}
        </TouchableOpacity>
        <Text style={styles.infoTitle}>Grupos de Información</Text>
        <TouchableOpacity style={styles.groupButton}>
          {/* ... */}
        </TouchableOpacity>
        {/* Repetir para cada grupo */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Ajustado al color de fondo de la imagen
  },
  supportSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    height: 80, // Ajustar según el tamaño de tu logo
    resizeMode: 'contain', // Para que la imagen del logo se ajuste sin deformarse
  },
  supportText: {
    fontSize: 14,
    color: '#5C6979',
    marginTop: 8,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: 'black',
    paddingHorizontal: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Repetir estilos para iconButton para cada categoría
  infoSection: {
    padding: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
    paddingBottom: 10,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEEE', // Ajustar según el diseño
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  groupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  
  clearButton: {
    padding: 10,
  },
  clearIcon: {
    width: 20,
    height: 20,
  },
  
  // ... otros estilos que necesites
});

export default DetailsScreen;
