import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import FloatingButtonAdmin from './FloatingButtonAdmin';
import ImagePicker from 'react-native-image-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';


type RootStackParamList = {
    Uiadmineventos: undefined;
  };

  const Uiadmineventos = () => {
    const navigation = useNavigation();
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState('');
    const [fecha, setFecha] = useState(new Date());
    const [link, setLink] = useState('');
    const [inscripcion, setInscripcion] = useState('');
  
    const handleSubmit = () => {
      // Aquí implementarías la lógica para enviar los datos a donde sea necesario
      alert('Evento registrado con éxito');
    };

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const pickImage = () => {
        const options = {
          mediaType: 'photo',
          quality: 1,
        };

      
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.errorCode) {
              console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
              // Establece el estado de la imagen aquí con el primer activo (asset)
              const source = { uri: response.assets[0].uri };
              setImagen(source.uri);
            }
          });
        };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
      };
    
      const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || fecha;
        setDatePickerVisibility(Platform.OS === 'ios');
        setFecha(new Date(currentDate)); // Asegúrate de que sea un objeto Date
    };
  
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.header}>
              <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
              <Image source={require('../imagenes/tsflo1.png')} style={styles.logo} />
              <Text style={styles.headerText}>Con el Apoyo de Tunari sin Fuego</Text>
            </View>
            <Text style={styles.description}>Registra Eventos</Text>
            <View style={styles.form}>
              <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
              <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} multiline />
              <View style={styles.imagePickerContainer}>
                <Text style={styles.imagePickerText}>Selecciona Imagen:</Text>
                <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
                  <Image source={require('../imagenes/imagen.png')} style={styles.imagePickerIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.datePickerContainer}>
                <Text style={styles.datePickerText}>Selecciona Fecha:</Text>
                <TouchableOpacity onPress={showDatePicker} style={styles.datePickerButton}>
                  <Image source={require('../imagenes/calendario.png')} style={styles.datePickerIcon} />
                </TouchableOpacity>
              </View>
              {fecha instanceof Date && (
    <Text style={styles.selectedDateText}>Fecha seleccionada: {fecha.toLocaleDateString()}</Text>
)}
              {isDatePickerVisible && (
                <DateTimePicker testID="dateTimePicker" value={fecha} mode="date" display="default" onChange={onDateChange} />
              )}
              <TextInput style={styles.input} placeholder="Link del Evento" value={link} onChangeText={setLink} />
              <TextInput style={styles.input} placeholder="Inscripción (Sí/No)" value={inscripcion} onChangeText={setInscripcion} />
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <FloatingButtonAdmin navigation={navigation} />
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
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 20,
    marginVertical: 10, // Espaciado vertical entre tarjetas
    // Sombras para darle un efecto elevado a las tarjetas
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4, // Sombras en Android
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
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
    position: 'absolute', // Asegúrate de que el botón flotante esté posicionado sobre el contenido
    bottom: 0, // Posiciónalo en la parte inferior
    width: '100%', // Que el ancho sea el 100% para centrar el botón dentro de esta vista
    alignItems: 'center', // Centra el botón flotante horizontalmente
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
});
export default Uiadmineventos;