import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView, Button ,ActivityIndicator,Alert} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import FloatingButtonAdmin from './FloatingButtonAdmin';
import ImagePicker from 'react-native-image-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { firebase } from '@react-native-firebase/storage'; // Importar Firebase Storage
import database from '@react-native-firebase/database'; // Importar Firebase Realtime Database
import { MediaType } from 'react-native-image-picker';
import { Platform } from 'react-native';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { PhotoQuality } from 'react-native-image-picker';
import { NavigationProp } from '@react-navigation/native';
import { ImageLibraryOptions } from 'react-native-image-picker'; // Importar react-native-image-picker

type RootStackParamList = {
    Uiadmineventos: undefined;
  };

  type Props = {
    navigation: NavigationProp<RootStackParamList>;
  };
  
  const Uiadmineventos: React.FC<Props> = ({ navigation }) => {
   //const navigation = useNavigation();
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState('');
    const [fecha, setFecha] = useState(new Date());
    const [link, setLink] = useState('');
    const [inscripcion, setInscripcion] = useState('');
    const [key, setKey] = useState(0);
    const [imageUploadMessage, setImageUploadMessage] = useState('');

   


    const [imageButtonText, setImageButtonText] = useState('Selecciona Imagen'); // Estado para el texto del botón de selección de imagen
const [isSubmitting, setIsSubmitting] = useState(false); // Estado para manejar el estado de carga
  
const handleSubmit = async () => {
    setIsSubmitting(true);
    let imageUrl = '';
    if (imagen) {
      const uploadUri = imagen;
      const filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
      const storageRef = firebase.storage().ref(`epr/eventos/${filename}`);
  
      try {
        await storageRef.putFile(uploadUri);
        imageUrl = await storageRef.getDownloadURL();
        setImageUploadMessage('Imagen Cargada');
      } catch (error) {
        console.error('Error al subir imagen:', error);
        Alert.alert('Error al subir la imagen');
        setIsSubmitting(false);
        return;
      }
    }
  
    try {
      const newEventRef = database().ref('/eventos').push();
      await newEventRef.set({
        nombre,
        descripcion,
        fecha: fecha.toISOString(),
        link,
        inscripcion,
        imagen: imageUrl,
      });
  
      Alert.alert('Evento registrado con éxito');
      resetForm(); // Llamar a la función para restablecer el formulario
      setKey(prevKey => prevKey + 1); // Incrementar la clave para forzar la actualización de la interfaz
    } catch (error) {
      console.error('Error al registrar evento:', error);
      Alert.alert('Error al registrar el evento');
    }
    setIsSubmitting(false);
  };

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const pickImage = () => {
      const options = {
        mediaType: 'photo',
        quality: 1,
      };
      
     

        // ...

        launchImageLibrary(options as ImageLibraryOptions, (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorMessage);
          } else if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
            const source = { uri: response.assets[0].uri };
            setImagen(source.uri);
          
            setImageButtonText('Imagen Seleccionada'); // Cambia el texto del botón cuando la imagen se selecciona
            setImageUploadMessage('Imagen Cargada'); // Establece el mensaje "Imagen Cargada"
          }
        });
    };

        const resetForm = () => {
            // Restablecer todos los estados a sus valores predeterminados
            setNombre('');
            setDescripcion('');
            setImagen('');
            setFecha(new Date());
            setLink('');
            setInscripcion('');
            setImageButtonText('Selecciona Imagen'); // Restablecer el texto del botón de selección de imagen
            setImageUploadMessage(''); // Limpiar el mensaje de carga de la imagen
          };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
      };
    
      const onDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || fecha;
        setDatePickerVisibility(Platform.OS === 'ios');
        setFecha(new Date(currentDate));
      };
  
      return (
        <SafeAreaView style={styles.container} key={key}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.header}>
              <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
              <Text style={styles.headerText}>Con el Apoyo de</Text>
              <Image source={require('../imagenes/instit2.png')} style={styles.logo} />
              
            </View>
            <Text style={styles.description}>Registra Eventos</Text>
            <View style={styles.form}>
              <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
              <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} multiline />
              <View style={styles.imagePickerContainer}>
  <Text style={styles.imagePickerText}>{imageButtonText}</Text>
  <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
    <Image source={require('../imagenes/imagen.png')} style={styles.imagePickerIcon} />
  </TouchableOpacity>
  <Text>{imageUploadMessage}</Text>
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
              
              <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
  {isSubmitting ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Text style={styles.buttonText}>Enviar</Text>
  )}
</TouchableOpacity>


            </View>
            <FloatingButtonAdmin navigation={navigation} />
          </ScrollView>
         
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