// OporVoluntarios.tsx
import React, { useState, useEffect } from 'react';
import { View, Linking,Platform,Text, StyleSheet, Image, ScrollView,FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation,useRoute  } from '@react-navigation/native';
import FloatingButtonBar from './FloatingButtonBar';
import database from '@react-native-firebase/database';

type RootStackParamList = {
  OporVolunt: undefined;
  OporVoluntarios: { oportunidad: OportunidadVoluntariado };
};

type OportunidadVoluntariado = {
  titulo: string;
  fecha: string;
  imagen: string;
  descripcion: string;
  id: string | null;
  cuerpo?: string;  // Agregar si no está presente
  link?: string;    // Agregar si no está presente
};

  const OporVoluntarios = () => {


const route = useRoute();
const { oportunidad } = route.params;
const [detallesOportunidad, setDetallesOportunidad] = useState(oportunidad);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    useEffect(() => {
      if (oportunidad.id) {
        const ref = database().ref(`/oportunidadesVoluntariado/${oportunidad.id}`);
        ref.on('value', snapshot => {
          const data = snapshot.val();
          if (data) {
            setDetallesOportunidad(prevState => ({ ...prevState, ...data }));
          }
        });
  
        return () => ref.off();
      }
    }, [oportunidad.id]);


   return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
          <Text style={styles.headerText}>Con el Apoyo de</Text>
          <Image source={require('../imagenes/logov5.png')} style={styles.logo} />
        </View>
        <View style={styles.postContainer}>
          <Image source={{ uri: detallesOportunidad.imagen }} style={styles.postImage} />
          <Text style={styles.postTitle}>{detallesOportunidad.titulo}</Text>
          <Text style={styles.postDescription}>{detallesOportunidad.descripcion}</Text>
          <Text style={styles.postBody}>{detallesOportunidad.cuerpo}</Text>
          <Text style={styles.postDate}>{detallesOportunidad.fecha}</Text>
          {detallesOportunidad.link && (
            <TouchableOpacity onPress={() => Linking.openURL(detallesOportunidad.link)}>
              <Text style={styles.linkStyle}>Más información</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <FloatingButtonBar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}
    
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
    postContainer: {
      backgroundColor: '#e9ebee',
      padding: 15,
      borderRadius: 10,
      margin: 20,
    },
    postImage: {
      width: '100%',
      height: 200,
      borderRadius: 10,
    },
    postTitle: {
      fontWeight: 'bold',
      fontSize: 18,
      marginVertical: 8,
    },
    postDescription: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    postDate: {
      fontSize: 12,
      color: '#666',
      marginTop: 5,
    },
    postBody: {
      fontSize: 14,
      color: '#333',
      marginTop: 10,
    },
    linkStyle: {
      color: '#1e90ff',
      marginTop: 10,
    },
        
  });
  
  export default OporVoluntarios;