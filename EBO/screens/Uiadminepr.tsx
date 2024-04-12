import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView, Button ,ActivityIndicator,Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FloatingButtonAdmin from './FloatingButtonAdmin';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { firebase } from '@react-native-firebase/storage'; // Importar Firebase Storage
import database from '@react-native-firebase/database'; // Importar Firebase Realtime Database
import { ImageLibraryOptions, MediaType } from 'react-native-image-picker';
import { NavigationProp, ParamListBase } from '@react-navigation/native';


type NavigationType = NavigationProp<ParamListBase>;

type RootStackParamList = {
    Uiadminepr: undefined;
  };

  const Uiadminepr = () => {
   // const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();ion<NavigationTy

   const navigation = useNavigation<NavigationProp<RootStackParamList>>();
   const [nombre, setNombre] = useState('');
   const [ciudad, setCiudad] = useState('');
   const [imagen, setImagen] = useState('');
   const [facebook, setFacebook] = useState('');
   const [telefono, setTelefono] = useState('');
   const [web, setWeb] = useState('');
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
    const storageRef = firebase.storage().ref(`epr/${filename}`);

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
    const newEventRef = database().ref('/epr').push();
    await newEventRef.set({
      nombre,
      ciudad,
      facebook,
      telefono,
      web,
      imagen: imageUrl,
    });

    Alert.alert('Unidad registrada con éxito');
    resetForm(); // Llamar a la función para restablecer el formulario
    setKey(prevKey => prevKey + 1); // Incrementar la clave para forzar la actualización de la interfaz
  } catch (error) {
    console.error('Error al registrar unidad:', error);
    Alert.alert('Error al registrar unidad');
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

      const launchImageLibraryOptions: ImageLibraryOptions = {
        mediaType: 'photo',
        quality: 1,
      };

      launchImageLibrary(launchImageLibraryOptions, (response) => {
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
          setCiudad('');
          setImagen('');
          setFacebook('');
          setTelefono('');
          setWeb('');
          setImageButtonText('Selecciona Imagen'); // Restablecer el texto del botón de selección de imagen
          setImageUploadMessage(''); // Limpiar el mensaje de carga de la imagen
        };

 

    return (
      <SafeAreaView style={styles.container} key={key}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.header}>
            <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
            <Text style={styles.headerText}>Con el Apoyo de </Text>
            <Image source={require('../imagenes/logov4.png')} style={styles.logo} />
            
          </View>
          <Text style={styles.description}>Registrar Unidad</Text>
          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.input} placeholder="Ciudad" value={ciudad} onChangeText={setCiudad} multiline />
            <TextInput style={styles.input} placeholder="Facebook" value={facebook} onChangeText={setFacebook} />
            <TextInput style={styles.input} placeholder="Telefono" value={telefono} onChangeText={setTelefono} />
            <TextInput style={styles.input} placeholder="Web" value={web} onChangeText={setWeb} />

            <View style={styles.imagePickerContainer}>
<Text style={styles.imagePickerText}>{imageButtonText}</Text>
<TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
  <Image source={require('../imagenes/imagen.png')} style={styles.imagePickerIcon} />
</TouchableOpacity>
<Text>{imageUploadMessage}</Text>
</View>
           
         
            
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
export default Uiadminepr;