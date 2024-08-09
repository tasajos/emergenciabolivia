import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert, Linking, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FloatingButtonBar from './FloatingButtonBar';
import { launchImageLibrary } from 'react-native-image-picker';
import { firebase } from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { ImageLibraryOptions } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import debounce from 'lodash.debounce';

type RootStackParamList = {
  ReporteEmergencia: undefined;
};

type NavigationType = StackNavigationProp<RootStackParamList>;

const ReporteEmergencia: React.FC = () => {
  const navigation = useNavigation<NavigationType>();
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('Pendiente');
  const [imagen, setImagen] = useState('');
  const [imageUploadMessage, setImageUploadMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [fechaActual, setFechaActual] = useState('');
  const [horaActual, setHoraActual] = useState('');
  const [location, setLocation] = useState<{ latitude: number | null; longitude: number | null; }>({
    latitude: null,
    longitude: null
  });
  const [isLocationObtained, setIsLocationObtained] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [newLocation, setNewLocation] = useState<{ latitude: number | null; longitude: number | null; }>({
    latitude: null,
    longitude: null
  });
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null); // Estado para almacenar el número de teléfono

  useEffect(() => {
    const obtenerFechaHora = () => {
      const fecha = new Date();
      setFechaActual(fecha.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' }));
      setHoraActual(fecha.toLocaleTimeString());
    };

    obtenerFechaHora();
    const intervalo = setInterval(obtenerFechaHora, 1000);

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    // Recuperar el número de teléfono de Firebase
    const phoneRef = database().ref('/whatsappnroapp');
    phoneRef.once('value')
      .then(snapshot => {
        setPhoneNumber(snapshot.val() || null);
      })
      .catch(error => {
        console.error('Error fetching phone number:', error);
      });
  }, []);

  const sendWhatsAppMessage = async (imageUrl: string, locationLink: string) => {
    try {
      if (!phoneNumber) {
        throw new Error('Número de teléfono no disponible.');
      }

      let message = `Hola, te envío los detalles de la alerta:\n` +
                    `Descripción: ${descripcion}\n` +
                    `Estado: ${estado}\n` +
                    `Fecha: ${fechaActual}\n` +
                    `Hora: ${horaActual}\n` +
                    `Ubicación: ${locationLink}\n`;

      if (imageUrl) {
        message += `Imagen: ${imageUrl}\n`;
      }

      let encodedMessage = encodeURIComponent(message);
      let url = `whatsapp://send?phone=591${phoneNumber}&text=${encodedMessage}`;

      await Linking.openURL(url);
    } catch (error) {
      console.error('Error:', error);
      setModalMessage('Ocurrió un error al enviar el mensaje.');
      setModalVisible(true);
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

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
            setIsLocationObtained(true);
          },
          (error) => {
            console.log(error);
            setModalMessage('No se pudo obtener la ubicación');
            setModalVisible(true);
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

  const handleMapPress = useCallback(debounce((coordinate) => {
    if (isLocationObtained) {
      setNewLocation({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
    }
  }, 500), [isLocationObtained]);

  const handleRegisterNewCoordinates = () => {
    setLocation(newLocation);
    setMapModalVisible(false);
    setModalMessage('Nuevas coordenadas registradas');
    setModalVisible(true);
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
        setModalMessage('Error al subir la imagen');
        setModalVisible(true);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const locationToUse = newLocation.latitude && newLocation.longitude ? newLocation : location;
      const locationLink = locationToUse.latitude && locationToUse.longitude ? `https://www.google.com/maps/search/?api=1&query=${locationToUse.latitude},${locationToUse.longitude}` : 'Ubicación no disponible';

      const newEventRef = database().ref('/ultimasEmergencias').push();
      await newEventRef.set({
        descripcion,
        estado,
        imagen: imageUrl,
        ubicacion: locationLink,
        fecha: fechaActual,
        hora: horaActual,
      });

      setModalMessage('Alerta registrada con éxito');
      setModalVisible(true);
      resetForm();

      sendWhatsAppMessage(imageUrl, locationLink);
    } catch (error) {
      console.error('Error al registrar unidad:', error);
      setModalMessage('Error al registrar unidad');
      setModalVisible(true);
    }
    setIsSubmitting(false);
  };

  const pickImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1,
    };
    
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
        const source = { uri: response.assets[0].uri };
        setImagen(source.uri);
        setImageUploadMessage('Imagen Cargada');
      }
    });
  };

  const removeImage = () => {
    setImagen('');
    setImageUploadMessage('');
  };

  const resetForm = () => {
    setDescripcion('');
    setEstado('Pendiente');
    setImagen('');
    setImageUploadMessage('');
    setLocation({ latitude: null, longitude: null });
    setIsLocationObtained(false);
    setNewLocation({ latitude: null, longitude: null });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.header}>
          <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
          <Text style={styles.headerText}>Con el Apoyo de </Text>
          <Image source={require('../imagenes/logov5.png')} style={styles.logo} />
        </View>
        <Text style={styles.description}>Alerta - Emergencia</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Descripción:</Text>
          <TextInput style={styles.input} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} multiline />
          
          <Text style={styles.label}>Estado:</Text>
          <Picker selectedValue={estado} onValueChange={(itemValue) => setEstado(itemValue)} style={styles.picker}>
            <Picker.Item label="Pendiente" value="Pendiente" />
          </Picker>

          <View style={styles.locationContainer}>
            <TextInput 
              style={[styles.input, styles.locationInput]} 
              placeholder="Ubicación" 
              value={location.latitude && location.longitude ? `${location.latitude}, ${location.longitude}` : ''} 
              editable={false}
            />
            <TouchableOpacity 
              style={[styles.button, styles.locationButton]} 
              onPress={getLocation}
            >
              <Text style={styles.buttonText}>Obtener Ubicación</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.button, styles.newLocationButton]} 
            onPress={() => setMapModalVisible(true)}
          >
            <Text style={styles.buttonText}>Registrar otra Ubicación</Text>
          </TouchableOpacity>

          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={{
                latitude: location.latitude || -17.413977,
                longitude: location.longitude || -66.165322,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsUserLocation={true}
              onPress={(e) => handleMapPress(e.nativeEvent.coordinate)}
            >
              {isLocationObtained && location.latitude && location.longitude && (
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
          <Text style={styles.input}>{fechaActual}</Text>

          <Text style={styles.label}>Hora:</Text>
          <Text style={styles.input}>{horaActual}</Text>

          <View style={styles.imagePickerContainer}>
            <Text style={styles.imagePickerText}>{imageUploadMessage || 'Selecciona Imagen'}</Text>
            <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
              <Image source={require('../imagenes/imagen.png')} style={styles.imagePickerIcon} />
            </TouchableOpacity>
          </View>

          {imagen ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imagen }} style={styles.imagePreview} />
              <TouchableOpacity onPress={removeImage} style={styles.removeImageButton}>
                <Text style={styles.removeImageButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.button, styles.viewEmergenciesButton]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.viewEmergenciesButtonText}>Registrar Emergencia</Text>
          )}
        </TouchableOpacity>

        <FloatingButtonBar navigation={navigation} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalMessage}>{modalMessage}</Text>
              <TouchableOpacity
                style={[styles.button, styles.modalButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={mapModalVisible}
          onRequestClose={() => setMapModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalMessage}>Selecciona una nueva ubicación</Text>
              <MapView
                style={styles.mapModal}
                region={{
                  latitude: location.latitude || -17.413977,
                  longitude: location.longitude || -66.165322,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={(e) => setNewLocation({
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude,
                })}
              >
                {newLocation.latitude && newLocation.longitude && (
                  <Marker
                    coordinate={{
                      latitude: newLocation.latitude,
                      longitude: newLocation.longitude,
                    }}
                    title={"Nueva Ubicación"}
                  />
                )}
              </MapView>
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.modalButton]}
                  onPress={handleRegisterNewCoordinates}
                >
                  <Text style={styles.modalButtonText}>Registrar Nuevas Coordenadas</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.modalButton]}
                  onPress={() => setMapModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  logo: {
    height: 50,
    resizeMode: 'contain',
    marginTop: 20,
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
    color: '#424242',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
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
    paddingBottom: '20%',
  },
  imagePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePickerText: {
    fontSize: 16,
    marginRight: 10,
    color: '#424242',
  },
  imagePickerButton: {
    padding: 10,
  },
  imagePickerIcon: {
    width: 30,
    height: 30,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
    color: '#424242',
  },
  viewEmergenciesButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: '20%',
    width: '60%',
  },
  viewEmergenciesButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationInput: {
    flex: 1,
    marginRight: 10,
  },
  locationButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
  },
  newLocationButton: {
    backgroundColor: '#007bff',
    marginTop: 10,
  },
  mapContainer: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapModal: {
    height: 400,
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    padding: 0,
  },
  modalMessage: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
    color: '#424242',
  },
  modalButtonsContainer: {
    width: '100%',
    padding: 20,
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  removeImageButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
  },
  removeImageButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ReporteEmergencia;