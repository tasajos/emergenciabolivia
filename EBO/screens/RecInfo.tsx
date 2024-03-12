import React, { useState ,useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome'; // you'll need to install this package
import FloatingButtonBar from './FloatingButtonBar';

type RootStackParamList = {
    Home: undefined;
    Details: undefined;
    RecInfo: undefined;
  };

type RecInfoScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RecInfo'
>;

type Props = {
  navigation: RecInfoScreenNavigationProp;
};




const RecInfo: React.FC<Props> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const clearSearch = () => {
        setSearchQuery('');
      };
    const items = [
        { name: 'Yunka Atoq Cochabamba', image: require('../imagenes/logos/yunka_atoq_log.png') },
        { name: 'Thasnuq Cochabamba', image: require('../imagenes/logos/thasnuq.jpg') },
        { name: 'Resistencia', image: require('../imagenes/logos/resistencia.jpeg') },
        { name: 'Cruz de Malta', image: require('../imagenes/logos/cruzdemalta.jpeg') },
        { name: 'Aeronauticos', image: require('../imagenes/logos/aeronauticosbv.jpg') },
        // ... add all your items here
      ];

    return (
        <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.headerContainer}>
            {/* Example of logo and text in header */}
            <Image source={require('../imagenes/tsflo1.png')} style={styles.logo} />
            <Text style={styles.supportText}>Con el Apoyo de Tunari sin Fuego</Text>
          </View>
          <View style={styles.searchContainer}>
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
                source={require('../imagenes/cerrars.png')} // Asegúrate de tener esta imagen o ícono en tus recursos
                style={styles.clearIcon}
              />
            </TouchableOpacity>
          )}
        </View>
          <View style={styles.dropdownContainer}>
            {/* Implement dropdown here */}
          </View>
          <View style={styles.gridContainer}>
            {items.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Image source={item.image} style={styles.itemImage} />
                <Text style={styles.itemText}>{item.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
        <FloatingButtonBar navigation={navigation} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      // ... other styles for your main container
    },
    scrollView: {
      // If you have specific styles for the ScrollView
    },
    headerContainer: {
      alignItems: 'center',
      padding: 20,
      // ... styles for your header
    },
    logo: {
      resizeMode: 'contain',
      height: 60,
      // ... other logo styles
    },
    supportText: {
      marginTop: 10,
      // ... other text styles
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center', // centra los ítems verticalmente
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#fff', // o cualquier color de fondo que desees
        borderWidth: 1, // opcional: si deseas un borde alrededor de todo el contenedor de búsqueda
        borderColor: '#ccc', // opcional: el color de ese borde
        borderRadius: 5, // opcional: bordes redondeados para el contenedor completo
      },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: 'black',
        paddingHorizontal: 10,
        borderWidth: 1, // añade borde de 1px
        borderColor: '#000', // el color del borde será negro
        borderRadius: 25, // los bordes redondeados con radio de 5px
        marginLeft: 10, // añade un pequeño margen a la izquierda si es necesario para separar del ícono
      },
    clearButton: {
        padding: 10,
      },
    dropdownContainer: {
      // ... styles for dropdown container
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      // ... styles for your grid container
    },
    itemContainer: {
      width: '40%', // Adjust the width as needed
      padding: 10,
      alignItems: 'center',
      marginBottom: 20,
      // ... other item container styles
    },
    itemImage: {
      width: 100,
      height: 100,
      // ... other image styles
    },
    itemText: {
      textAlign: 'center',
      marginTop: 5,
      // ... other text styles
    },
    footerContainer: {
      // ... styles for your footer
    },
    floatingButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: 'red',
      padding: 15,
      borderRadius: 30,
      // ... other floating button styles
    },
    clearIcon: {
        width: 20,
        height: 20,
      },
      searchIcon: {
        width: 20,
        height: 20,
        margin: 10, // asegúrate de que el ícono no esté pegado al borde
      },
      


    // ... cualquier otro estilo que necesites
});

export default RecInfo;
