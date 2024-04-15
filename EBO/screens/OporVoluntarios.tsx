// OporVoluntarios.tsx
import React, { useState, useEffect } from 'react';
import { View, Linking,Platform,Text, StyleSheet, Image, ScrollView,FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import FloatingButtonBar from './FloatingButtonBar';
import RoadMapItem from './RoadMapItem'; // Asegúrate de crear este componente como se mencionó anteriormente


type RootStackParamList = {
    OporVolunt: undefined;
  };



  const OporVoluntarios = () => {

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();


    return (
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
            <Text style={styles.headerText}>Con el Apoyo de</Text>
            <Image source={require('../imagenes/logov5.png')} style={styles.logo} />
          </View>


        <View style={styles.footer}>
      <FloatingButtonBar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};
    
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1, // Important to ensure it takes up remaining space and allows for scrolling
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    headerImage: {
      width: '80%',
      height: 60,
      resizeMode: 'contain',
    },
    headerText: {
      fontSize: 20,
      color: '#424242',
      marginTop: 20,
      fontWeight: 'bold',
    },
    description: {
      fontSize: 18,
      textAlign: 'center',
      marginHorizontal: 20,
      marginBottom: 20,
      color: '#424242',
    },
        
       
    logo: {
      height: 50,
      resizeMode: 'contain',
      marginTop: 20,
    },
    roadMapContainer: {
        marginHorizontal: 20, // Esto agregará un margen a los lados
        marginTop: 20, // Esto agregará un margen en la parte superior
      },
      bannerStyle: {
        width: '100%', // La imagen llena el contenedor
        height: '100%', // La imagen llena el contenedor
        resizeMode: 'cover', // La imagen cubre todo el espacio, las esquinas redondeadas serán visibles
      },

            bannerContainer: {
                width: '100%', // Asegura que el contenedor tenga el ancho completo
                height: 120, // Altura para el contenedor, igual que la imagen
                borderRadius: 10, // Redondea las esquinas del contenedor
                overflow: 'hidden', // Asegura que todo dentro del contenedor se recorte a las esquinas redondeadas
                marginVertical: 20, // Margen vertical para la separación
                elevation: 5, // Sombra para Android
                ...Platform.select({ // Sombra para iOS
                  ios: {
                    shadowColor: 'black',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                  },
                }),
              },
        
    footer: {
    padding: 20,  // This padding serves as the margin around the floating bar
    },
        
  });
  
  export default OporVoluntarios;