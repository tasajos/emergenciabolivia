import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView, Button ,ActivityIndicator,Alert,FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FloatingButtonAdmin from './FloatingButtonAdmin';
import { launchImageLibrary } from 'react-native-image-picker';
import { firebase } from '@react-native-firebase/storage'; // Importar Firebase Storage
import database from '@react-native-firebase/database'; // Importar Firebase Realtime Database
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { ImageLibraryOptions } from 'react-native-image-picker';


type RootStackParamList = {
    Uiadmineventos: undefined;
    UiEditarEvento: { id: string }; // Asegúrate de que esta línea esté presente
  };

  interface Alerta {
    key: string;
    nombre: string;
    descripcion: string;
    ciudad: string;
    estado: string;
    fecha: string;
  }


  type NavigationType = StackNavigationProp<RootStackParamList>;


 const Uivereventos: React.FC = () => {
    const navigation = useNavigation<NavigationType>();
    const [alertas, setAlertas] = useState<Alerta[]>([]);

    useEffect(() => {
        const alertasRef = database().ref('/eventos');
        const onValueChange = alertasRef.on('value', (snapshot) => {
          const data = snapshot.val();
          const alertasList = Object.keys(data).map((key) => ({
            key,
            ...data[key],
          }));
          setAlertas(alertasList);
        });
    
        return () => alertasRef.off('value', onValueChange);
      }, []);
    
      const renderItem = ({ item }: { item: Alerta }) => (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.nombre}</Text>
          <Text>{item.ciudad}</Text>
          <Text>{item.descripcion}</Text>
          <Text>{item.estado}</Text>
          <Text>{item.fecha}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('UiEditarEvento', { id: item.key })}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>
      );
    

      return (
        <SafeAreaView style={styles.container}>
          
            <View style={styles.header}>
              <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
              <Text style={styles.headerText}>Con el Apoyo de </Text>
              <Image source={require('../imagenes/logov4.png')} style={styles.logo} />
            </View>
            <Text style={styles.description}>Ver - Eventos</Text>
            <FlatList
              data={alertas}
              renderItem={renderItem}
              keyExtractor={(item) => item.key}
            />
             <View style={styles.floatingButtonContainer}>
      <FloatingButtonAdmin navigation={navigation} />
    </View>
        </SafeAreaView>
      );
    };

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
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
      fontSize: 16,
      color: '#424242',
      marginTop: 20,
    },
    description: {
      fontSize: 16,
      textAlign: 'center',
      marginHorizontal: 20,
      marginBottom: 20,
      color: '#424242',
    },
    backpackIcon: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
      alignSelf: 'center',
      margin: 20,
    },
      logo: {
      height: 50,
      resizeMode: 'contain',
      marginTop: 20,
    },
    listContainer: {
      paddingHorizontal: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
      },
      cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4b4f56',
      },
      cardDescription: {
        fontSize: 14,
        color: '#606770',
        marginTop: 5,
      },
    form: {
      margin: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 15,
      marginBottom: 10,
      fontSize: 16,
    },
    button: {
      backgroundColor: '#007bff',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    scrollViewContainer: {
      paddingBottom: '20%', // Deja espacio en la parte inferior equivalente al 20% del contenedor
    },
    floatingButtonContainer: {
        height: '8%', // Establecer la altura al 15% de la pantalla
        justifyContent: 'center', // Centrar el botón verticalmente
        alignItems: 'center', // Centrar el botón horizontalmente
        backgroundColor: 'white', // Color de fondo para la sección del botón
      },
      floatingButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
      },
      floatingButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
    fixedButton: {
      // ya no es necesario posicionarlo absolutamente, por lo tanto, elimina las siguientes líneas:
      // position: 'absolute',
      // bottom: 0,
      paddingVertical: 20, // agregar algo de espacio alrededor del botón
      alignItems: 'center',
      width: '100%',
    },
    imagePickerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    imagePickerText: {
      fontSize: 16,
      marginRight: 10,
    },
    imagePickerButton: {
      padding: 10,
    },
    imagePickerIcon: {
      width: 30,
      height: 30,
    },
    datePickerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    datePickerText: {
      fontSize: 16,
      marginRight: 10,
    },
    datePickerButton: {
      padding: 10,
    },
    datePickerIcon: {
      width: 30,
      height: 30,
    },
    selectedDateText: {
      fontSize: 16,
      marginBottom: 15,
      textAlign: 'center',
    },
    picker: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 15,
      marginBottom: 10,
      fontSize: 16,
    },
    viewEmergenciesButton: {
      backgroundColor: '#007bff',
      padding: 5, // Reducir el padding para disminuir el tamaño
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 20,
      marginHorizontal: '5%', // Centrar el botón en el contenedor
      width: '30%', // Establecer el ancho al 10% del contenedor
    },
    viewEmergenciesButtonText: {
      color: 'white',
      fontSize: 12, // Reducir el tamaño de la fuente
      fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: '#007bff',
        padding: 5, // Reducir el padding
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        width: '30%', // Establecer el ancho al 30% del tamaño actual
      },
      editButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },


    });
    export default Uivereventos;