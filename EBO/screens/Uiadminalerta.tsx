import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView, Button ,ActivityIndicator,Alert,Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FloatingButtonAdmin from './FloatingButtonAdmin';
import { launchImageLibrary } from 'react-native-image-picker';
import { firebase } from '@react-native-firebase/storage'; // Importar Firebase Storage
import database from '@react-native-firebase/database'; // Importar Firebase Realtime Database
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { ImageLibraryOptions } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';


type RootStackParamList = {
    Uiadminalerta: undefined;
    Uiveralertas: undefined;
  };


  type NavigationType = StackNavigationProp<RootStackParamList>;

 
  const Uiadminalerta: React.FC = () => {
   // const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
   const navigation = useNavigation<NavigationType>();

   const [Titulo, setTitulo] = useState('');
   const [ciudad, setCiudad] = useState('Cochabamba');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [imagen, setImagen] = useState('');
  const [imageUploadMessage, setImageUploadMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);

  //const [location, setLocation] = useState('');
  const [location, setLocation] = useState<{ latitude: number | null; longitude: number | null; }>({
    latitude: null,
    longitude: null
  });

  const openWhatsApp = () => {
    // Reemplaza con tu número de teléfono en formato internacional sin '+' ni '00'
    let phoneNumber = '59170776212';
  
    let message = 'Hola, me gustaría obtener más información.'; // Mensaje que deseas enviar
    
    // Codifica el mensaje para que sea una URL válida
    let encodedMessage = encodeURIComponent(message);
    
    // Abre WhatsApp directamente con el número y el mensaje especificado
    let url = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
    
    Linking.openURL(url).catch((err) => {
      console.error('An error occurred', err);
      //alert('No se puede abrir WhatsApp, asegúrate de que está instalado en tu dispositivo.');
      Alert.alert('No se puede abrir WhatsApp, asegúrate de que está instalado en tu dispositivo.');
    });
  };


  const sendWhatsAppMessage = async () => {
    setIsSendingWhatsApp(true);
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
        setIsSendingWhatsApp(false); // Asegúrate de cambiar el estado en caso de error
        return; // Salir de la función si falla la subida de la imagen
      }
    }
  
    try {
      const newEventRef = database().ref('/ultimasEmergencias').push();
      await newEventRef.set({
        Titulo,
        ciudad,
        descripcion,
        estado,
        fecha,
        imagen: imageUrl,
        ubicacion: location.latitude && location.longitude ? `${location.latitude}, ${location.longitude}` : ''
      });
  
      Alert.alert('Alerta registrada con éxito');
      resetForm();
  
      // Crear enlace de Google Maps para la ubicación
      const locationLink = location.latitude && location.longitude ? `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}` : 'Ubicación no disponible';
      
      let message = `Hola, te envío los detalles de la alerta:\n` +
                    `Título: ${Titulo}\n` +
                    `Ciudad: ${ciudad}\n` +
                    `Descripción: ${descripcion}\n` +
                    `Estado: ${estado}\n` +
                    `Fecha: ${fecha}\n` +
                    `Ubicación: ${locationLink}\n`;
  
      if (imageUrl) {
        message += `Imagen: ${imageUrl}\n`; // Añadir la imagen solo si existe
      }
  
      let encodedMessage = encodeURIComponent(message);
      const phoneNumber = '59170776212';
      let url = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
  
      await Linking.openURL(url); // Espera a que se abra WhatsApp
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Ocurrió un error al enviar el mensaje.');
    } finally {
      setIsSendingWhatsApp(false); // Cambia el estado al finalizar el proceso
    }
};
   
  //continuacion






   const [imageButtonText, setImageButtonText] = useState('Selecciona Imagen'); // Estado para el texto del botón de selección de imagen
//const [isSubmitting, setIsSubmitting] = useState(false); // Estado para manejar el estado de carga



const getLocation = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "This app needs access to your location.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log(error);
          Alert.alert('Error', 'No se pudo obtener la ubicación');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      console.log("Location permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};



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

    const locationLink = location.latitude && location.longitude ? `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}` : 'Ubicación no disponible';

    const newEventRef = database().ref('/ultimasEmergencias').push();
    await newEventRef.set({
      Titulo,
      ciudad,
      descripcion,
      estado,
      fecha,
      imagen: imageUrl,
      //ubicacion: location.latitude && location.longitude ? `${location.latitude}, ${location.longitude}` : ''
      ubicacion: locationLink
    });

    Alert.alert('Alerta registrada con éxito');
    resetForm(); // Llamar a la función para restablecer el formulario
    //sendWhatsAppMessage();
    //setKey(prevKey => prevKey + 1); // Incrementar la clave para forzar la actualización de la interfaz
  } catch (error) {
    console.error('Error al registrar unidad:', error);
    Alert.alert('Error al registrar unidad');
  }
  setIsSubmitting(false);
};

  //const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const pickImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1,
    };
    


      // Rest of the code...
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
          const source = { uri: response.assets[0].uri };
          setImagen(source.uri);
          setImageButtonText('Imagen Seleccionada');
          setImageUploadMessage('Imagen Cargada');
        }
      });
    };

      const resetForm = () => {
          // Restablecer todos los estados a sus valores predeterminados
          setTitulo('');
    setCiudad('');
    setDescripcion('');
    setEstado('Activo');
    setFecha(new Date().toISOString().slice(0, 10));
    setImagen('');
    setImageUploadMessage('');
  };

 

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.header}>
            <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
            <Text style={styles.headerText}>Con el Apoyo de </Text>
            <Image source={require('../imagenes/logov5.png')} style={styles.logo} />
            
          </View>
          <Text style={styles.description}>Alertas - Emergencia</Text>

          <TouchableOpacity 
  style={styles.viewEmergenciesButton}
  onPress={() => navigation.navigate('Uiveralertas')} // Agrega la navegación aquí
>
  <Text style={styles.viewEmergenciesButtonText}>Ver Emergencias</Text>
</TouchableOpacity>



          <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Título" value={Titulo} onChangeText={setTitulo} />
          
          <Text style={styles.label}>Ciudad:</Text>
          <Picker selectedValue={ciudad} onValueChange={(itemValue) => setCiudad(itemValue)} style={styles.picker}>
          <Picker.Item label="Cochabamba" value="Cochabamba" />
          <Picker.Item label="Santa Cruz" value="Santa Cruz" />
          <Picker.Item label="Potosi" value="Potosi" />
          <Picker.Item label="La Paz" value="La Paz" />
          <Picker.Item label="Beni" value="Beni" />
          <Picker.Item label="Pando" value="Pando" />
          <Picker.Item label="Tarija" value="Tarija" />
          <Picker.Item label="Oruro" value="Oruro" />
          <Picker.Item label="Chuquisaca" value="Chuquisaca" />
          </Picker>

          <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} multiline />
          
          <Text style={styles.label}>Estado:</Text>
          <Picker selectedValue={estado} onValueChange={(itemValue) => setEstado(itemValue)} style={styles.picker}>
            <Picker.Item label="Activo" value="Activo" />
            <Picker.Item label="Controlado" value="Controlado" />
            <Picker.Item label="Atendido" value="Atendido" />
            <Picker.Item label="Vencido" value="Vencido" />
          </Picker>

          <View style={styles.locationContainer}>
          <TextInput 
  style={[styles.input, styles.locationInput]} 
  placeholder="Ubicación" 
  value={location.latitude && location.longitude ? `${location.latitude}, ${location.longitude}` : ''} 
  editable={false} // Esto hace que el input no sea editable
/>
  <TouchableOpacity 
    style={[styles.button, styles.locationButton]} 
    onPress={getLocation}
  >
    <Text style={styles.buttonText}>Obtener Ubicación</Text>
  </TouchableOpacity>
</View>

<View style={styles.mapContainer}>
  <MapView
    style={styles.map}
    region={{
      latitude: location.latitude || -17.413977, // Coordenadas predeterminadas o actuales
      longitude: location.longitude || -66.165322,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
    showsUserLocation={true}
  >
    {location.latitude && location.longitude && (
      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        title={"Tu Ubicación"}
      />
    )}
  </MapView>
</View>


<Text style={styles.label}>Fecha:</Text>
          <TextInput style={styles.input} placeholder="Fecha (AAAA-MM-DD)" value={fecha} onChangeText={setFecha} />
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
        <TouchableOpacity
  style={styles.button}
  onPress={sendWhatsAppMessage}
  disabled={isSendingWhatsApp || isSubmitting}
>
  {isSendingWhatsApp ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Text style={styles.buttonText}>Enviar a WhatsApp</Text>
  )}
</TouchableOpacity>



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
label: {
  fontSize: 16,
  marginBottom: 10,
  color: '#424242',
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
  padding: 4, // Reducir el padding para disminuir el tamaño
  borderRadius: 5,
  alignItems: 'center',
  marginBottom: 20,
  marginHorizontal: '5%', // Centrar el botón en el contenedor
  width: '40%', // Establecer el ancho al 10% del contenedor
},
viewEmergenciesButtonText: {
  color: 'white',
  fontSize: 12, // Reducir el tamaño de la fuente
  fontWeight: 'bold',
},
locationContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
},

locationInput: {
  flex: 1, // Ocupa todo el espacio posible en la fila
  marginRight: 10, // Añade un margen a la derecha del input
},

locationButton: {
  backgroundColor: '#007bff',
  paddingHorizontal: 15,
},

mapContainer: {
  height: 200, // Ajusta la altura según lo que necesites
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
},
map: {
  ...StyleSheet.absoluteFillObject,
},
});
export default Uiadminalerta;