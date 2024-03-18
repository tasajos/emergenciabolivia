// Rscreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, SafeAreaView ,Linking} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import FloatingButtonBar from './FloatingButtonBar';

// Define el tipo para tus emergencias asistencia medica
type emeram = {
    key: string;
    imagen: string;
    Descripcion: string;
    Fecha: string;
    Nombre: string;
    Estado: string;
  };

  type RootStackParamList = {
    // ... otros parámetros de tus rutas
    AsistenciaMedica: undefined; // Asegúrate de tener una ruta Eventos en tu StackNavigator
  };

  const Rscreen = () => {
    const [evts, setEvts] = useState<emeram[]>([]);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const ref = database().ref('/rescate');
    ref.on('value', (snapshot) => {
      const data = snapshot.val();
      const evtsList = Object.keys(data).map(key => ({
        key: key,
        ...data[key]
      }));
      setEvts(evtsList);
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
        data={evts}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <Image source={{ uri: item.imagen }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.Nombre}</Text>
                <Text style={styles.cardInfo}>{`Fecha: ${item.Fecha}`}</Text>
                <Text style={styles.cardInfo}>{`Descripcion: ${item.Descripcion}`}</Text>
                <Text style={styles.cardInfo}>{`Estado: ${item.Estado}`}</Text>
                {/* Agrega un toque de Texto para abrir el enlace */}
                <Text style={styles.cardInfo}>{`Mas Informacion:`}</Text>
                <Text 
                  style={styles.linkStyle} 
                  onPress={() => Linking.openURL(item.link)}>
                  {item.link}
                </Text>
              </View>
            </View>
        )}
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
   
    row: {
      flex: 1,
      justifyContent: 'space-around',
    },
    logo: {
      height: 50, // Ajusta la altura de tu logo
      resizeMode: 'contain', // Contiene la imagen dentro del espacio disponible sin deformarla
      marginTop: 20, // Ajusta el margen superior si es necesario
    },
    cardContainer: {
        flexDirection: 'row',
        backgroundColor: '#B0B3B3',
        borderBottomWidth: 2,
        borderBottomColor: '#eee',
        padding: 2,
        alignItems: 'center',
        marginBottom: 5, // Separación entre tarjetas
        borderRadius: 20, // Bordes redondeados
        marginHorizontal: 10,
      },
      cardImage: {
        width: 80, // Ajusta según el tamaño de tus imágenes
        height: 80, // Ajusta según el tamaño de tus imágenes
        borderRadius: 20, // Ajusta para hacer la imagen redonda
        marginRight: 40,
        marginLeft: 10,
      },
      cardContent: {
        flex: 1,
      },
      cardTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#000',
      },
      cardInfo: {
        fontSize: 14,
        color: 'black',
      },
      linkStyle: {
        color: '#0645AD', // Color típico de enlace
        textDecorationLine: 'underline', // Subraya el texto para parecer un enlace
        fontSize: 14,
        marginTop: 5, // Espacio adicional si es necesario
      },

    // ... Agrega más estilos según sea necesario
  });
  export default Rscreen;