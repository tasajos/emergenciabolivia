// Voluntarios.tsx
import React, { useState, useEffect } from 'react';
import { View, Linking,Platform,Text, StyleSheet, Image, ScrollView,FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import FloatingButtonBar from './FloatingButtonBar';
import RoadMapItem from './RoadMapItem'; // Asegúrate de crear este componente como se mencionó anteriormente




type RootStackParamList = {
    Volunt: undefined;
  };

  const Voluntarios = () => {


    


    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    

    type RoadMapStep = {
        step: string;
        description: string;
        imageSource: NodeRequire;
        isLink: boolean;
        link?: string; // El signo de pregunta indica que este campo es opcional
      };

// Define los pasos de tu roadmap aquí
const roadMapSteps = [
    {
      step: 'Paso 1',
      description: 'Ingresa a la unidad de voluntarios de tu preferencias desde el menu principal',
      imageSource: require('../imagenes/circulo.png'), // Asegúrate de tener esta imagen en tu proyecto
      isLink: false
    },
    {
        step: 'Paso 2',
        description: 'Comunicate directamente con la institucion atraves del whatsapp proporcionado en la aplicacion',
        imageSource: require('../imagenes/circulo.png'), // Asegúrate de tener esta imagen en tu proyecto
        isLink: false
      },
      {
        step: 'Paso 3',
        description: 'Haz las consultas necesarias para ser parte de la institucion',
        imageSource: require('../imagenes/circulo.png'), // Asegúrate de tener esta imagen en tu proyecto
        isLink: false,
      
      },
      {
        step: 'Paso 4 - Opcional',
        description: 'CLICK AQUI!....Para ingresar al canal de whatsapp de Voluntarios Bolivia, para saber mas noticias del mundo de voluntariado',
        imageSource: require('../imagenes/circulo.png'), // Asegúrate de tener esta imagen en tu proyecto
        isLink: true,
      link: 'https://whatsapp.com/channel/0029VabE8nN7DAWtEBn6Pq2y'
      },
    // Repite para más pasos...
  ];

  const openLink = (url: string) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log("Link not supported");
          Alert.alert("Error", "No se puede abrir este enlace");
        }
      })
      .catch((err) => {
        console.error('An error occurred', err);
        Alert.alert("Error", "Ocurrió un error al intentar abrir el enlace");
      });
  };

  const openWhatsApp = () => {
    console.log("Intentando abrir WhatsApp...");
    const url = 'https://whatsapp.com/channel/0029VabE8nN7DAWtEBn6Pq2y';
    Linking.openURL(url).catch(err => {
        console.error('An error occurred', err);
        Alert.alert("Error", "Ocurrió un error al intentar abrir el enlace");
    });
};




  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
        <Text style={styles.headerText}>Con el Apoyo de</Text>
        <Image source={require('../imagenes/logov5.png')} style={styles.logo} />
      </View>
      
      <Text style={styles.description}>Sigue los pasos para convertirte en un Voluntario</Text>

      <View style={styles.bannerContainer}>
        <Image source={require('../imagenes/Bvoluntarios.jpg')} style={styles.bannerStyle} />
      </View>
      <ScrollView style={styles.scrollView}>
      <View style={styles.roadMapContainer}>
        {roadMapSteps.map((item, index) => (
          item.isLink ? (
            <TouchableOpacity key={index} onPress={() => item.isLink ? openWhatsApp() : null}>
        <RoadMapItem step={item.step} description={item.description} imageSource={item.imageSource} />
    </TouchableOpacity>
          ) : (
            <RoadMapItem key={index} step={item.step} description={item.description} imageSource={item.imageSource} />
          )
        ))}
      </View>
      </ScrollView>
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
  
  export default Voluntarios;