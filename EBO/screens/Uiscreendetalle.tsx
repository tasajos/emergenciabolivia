import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, Button, Alert, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import FloatingButtonAdmin from './FloatingButtonAdmin';
import { Picker } from '@react-native-picker/picker';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, RouteProp } from '@react-navigation/native';

type EmergencyDetail = {
  key: string;
  title: string;
  city: string;
  description: string;
  type: string;
  state: string;
  date: string;
  time: string;
  imageUrl: string;
  ubicacion: string;
  subestado?: string;
  unidad?: string;
  telefonoResponsable?: string;
  necesitaAyuda?: string;
  notas?: string;
};

type EmergencyHistory = {
  subestado?: string;
  unidad?: string;
  telefonoResponsable?: string;
  timestamp: number;
  necesitaAyuda?: string;
  notas?: string;
  imageUrl?: string;
};

type UiscreendetalleRouteProp = RouteProp<{ params: { item: EmergencyDetail } }, 'params'>;



type Props = {
  route: UiscreendetalleRouteProp;
};

const Uiscreendetalle: React.FC<Props> = ({ route }) => {
  const { item } = route.params;
  const navigation = useNavigation();
  const coordinates = item.ubicacion?.split('query=').pop()?.split(',').map(Number);

  const [subestado, setSubestado] = useState(item.subestado || '');
  const [unidad, setUnidad] = useState(item.unidad || '');
  const [telefonoResponsable, setTelefonoResponsable] = useState(item.telefonoResponsable || '');
  const [history, setHistory] = useState<EmergencyHistory[]>([]);
  const [necesitaAyuda, setNecesitaAyuda] = useState(item.necesitaAyuda || '');
  const [notas, setNotas] = useState(item.notas || '');
  const [modalVisible, setModalVisible] = useState(false);
  const [sciActivated, setSciActivated] = useState(false);

  const [existingImage, setExistingImage] = useState<string | null>(item.imageUrl || null);
  const [newImage, setNewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const ref = firebase.database().ref(`/ultimasEmergencias/${item.key}/historial`);
    ref.on('value', snapshot => {
      const historyData: EmergencyHistory[] = [];
      snapshot.forEach(child => {
        const data = child.val() as EmergencyHistory;
        historyData.push(data);
      });
      setHistory(historyData);
    });

    // Check if SCI is already activated
    const checkSCIActivated = async () => {
      const value = await AsyncStorage.getItem(`sciActivated_${item.key}`);
      if (value === 'true') {
        setSciActivated(true);
      }
    };

    checkSCIActivated();

    return () => ref.off('value');
  }, [item.key]);

  const handleUpdate = async () => {
    if (!item.key) {
      Alert.alert("Error", "No se encontró un identificador único para la actualización.");
      return;
    }

    try {
      const updateRef = firebase.database().ref(`/ultimasEmergencias/${item.key}`);
      const newHistoryRef = updateRef.child('historial').push();
      await updateRef.update({
        subestado,
        unidad,
        telefonoResponsable,
        necesitaAyuda,
        notas,
        imageUrl: existingImage, // Keep the existing image URL
      });
      await newHistoryRef.set({
        subestado,
        unidad,
        telefonoResponsable,
        timestamp: Date.now(),
        necesitaAyuda,
        notas,
        imageUrl: newImage, // Add the new image URL to history
      });

      Alert.alert('Actualización exitosa', 'La información se ha actualizado correctamente.', [
        { text: "OK", onPress: () => navigation.push('Uiscreendetalle', { item: { ...item, key: item.key } }) }
      ]);
    } catch (error) {
      Alert.alert('Error al actualizar', error.message);
    }
  };

  const handleActivateSCI = () => {
    setModalVisible(true);
  };

  const confirmActivateSCI = async () => {
    setModalVisible(false);
    setSciActivated(true);
    await AsyncStorage.setItem(`sciActivated_${item.key}`, 'true');
    Alert.alert('SCI Activado', 'El Sistema de Comando de Incidentes ha sido activado.');
  };

  const navigateToSCIForm = () => {
    navigation.navigate('SCIForm', { item });
  };

  const pickNewImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.log('ImagePicker Error: ', result.errorMessage);
    } else if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.uri) {
        uploadNewImage(asset.uri);
      }
    }
  };

  const uploadNewImage = async (uri: string) => {
    setUploading(true);
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = firebase.storage().ref(`emergencias/${filename}`);
    const task = storageRef.putFile(uri);

    task.on('state_changed', 
      snapshot => {},
      error => {
        console.error('Error uploading image:', error);
        Alert.alert('Error al subir la imagen');
        setUploading(false);
      },
      async () => {
        const url = await storageRef.getDownloadURL();
        setNewImage(url);
        Alert.alert('Imagen subida', 'La nueva imagen se ha subido correctamente');
        setUploading(false);
      }
    );
  };

  const removeNewImage = () => {
    setNewImage(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
          <Text style={styles.headerText}>Detalle de la Emergencia</Text>
          <Image source={require('../imagenes/logov5.png')} style={styles.logo} />
        </View>

        {coordinates && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: coordinates[0],
                longitude: coordinates[1],
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}>
              <Marker
                coordinate={{ latitude: coordinates[0], longitude: coordinates[1] }}
                title={item.title}
                description={item.description}
              />
            </MapView>
          </View>
        )}

        {existingImage && (
          <View style={styles.imageContainer}>
            <Text style={styles.label}>Imagen existente:</Text>
            <Image source={{ uri: existingImage }} style={styles.image} />
          </View>
        )}

        <View style={styles.detailContainer}>
          <Text style={styles.title}>{item.title} - {item.city}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.info}>{item.type} - {item.state}</Text>
          <Text style={styles.info}>{item.date} - {item.time}</Text>

          <Text style={styles.label}>Subestado:</Text>
          <Picker
            selectedValue={subestado}
            onValueChange={(itemValue, itemIndex) => setSubestado(itemValue)}
            style={styles.picker}>
            <Picker.Item label="Seleccione una Opcion" value="" />
            <Picker.Item label="Atendiendo" value="Atendiendo" />
            <Picker.Item label="Rumbo a la emergencia" value="Rumbo a la emergencia" />
            <Picker.Item label="Completado" value="Completado" />
          </Picker>

          <Text style={styles.label}>Unidad:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setUnidad}
            value={unidad}
            placeholder="Ingrese la unidad"
          />

          <Text style={styles.label}>Teléfono del responsable:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setTelefonoResponsable}
            value={telefonoResponsable}
            placeholder="Ingrese el teléfono del responsable"
            keyboardType="phone-pad"
          />
          <Text style={styles.label}>Necesita ayuda:</Text>
          <Picker
            selectedValue={necesitaAyuda}
            onValueChange={setNecesitaAyuda}
            style={styles.picker}>
            <Picker.Item label="Seleccione una Opción" value="" />
            <Picker.Item label="Sí" value="Sí" />
            <Picker.Item label="No" value="No" />
          </Picker>

          <Text style={styles.label}>Notas:</Text>
          <TextInput
            style={styles.input}
            onChangeText={setNotas}
            value={notas}
            placeholder="Ingrese notas adicionales"
            multiline
          />

          <TouchableOpacity onPress={pickNewImage} style={styles.uploadImageButton}>
            <Text style={styles.uploadImageButtonText}>Cargar Nueva Imagen</Text>
          </TouchableOpacity>

          {uploading && <ActivityIndicator size="large" color="#0000ff" />}

          {newImage && (
            <View style={styles.imageContainer}>
              <Text style={styles.label}>Nueva Imagen:</Text>
              <Image source={{ uri: newImage }} style={styles.image} />
              <TouchableOpacity onPress={removeNewImage} style={styles.removeImageButton}>
                <Text style={styles.removeImageButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          )}

          <Button title="Actualizar Información" onPress={handleUpdate} />

          <TouchableOpacity style={styles.activateButton} onPress={handleActivateSCI}>
            <Text style={styles.activateButtonText}>Activar SCI</Text>
          </TouchableOpacity>

          {sciActivated && (
            <TouchableOpacity style={styles.viewSCIButton} onPress={navigateToSCIForm}>
              <Text style={styles.viewSCIButtonText}>Ver SCI</Text>
            </TouchableOpacity>
          )}

          {/* Display history */}
          {history.map((entry, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyText}>Subestado: {entry.subestado}</Text>
              <Text style={styles.historyText}>Unidad: {entry.unidad}</Text>
              <Text style={styles.historyText}>Teléfono: {entry.telefonoResponsable}</Text>
              <Text style={styles.historyText}>Necesita ayuda: {entry.necesitaAyuda}</Text>
              <Text style={styles.historyText}>Notas: {entry.notas}</Text>
              {entry.imageUrl && (
                <View style={styles.imageContainer}>
                  <Text style={styles.historyText}>Imagen:</Text>
                  <Image source={{ uri: entry.imageUrl }} style={styles.image} />
                </View>
              )}
              <Text style={styles.historyText}>Fecha: {new Date(entry.timestamp).toLocaleString('es-BO', { timeZone: 'America/La_Paz' })}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <FloatingButtonAdmin />

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>¿Desea activar SCI?</Text>
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Confirmar" onPress={confirmActivateSCI} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    marginBottom: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  headerImage: {
    width: '100%',
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    color: '#424242',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logo: {
    height: 50,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  mapContainer: {
    height: 250,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  uploadImageButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginVertical: 10,
    width: 150,
  },
  uploadImageButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  detailContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  description: {
    fontSize: 18,
    marginBottom: 8,
    color: 'black',
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
    color: 'black',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    color: 'black',
  },
  picker: {
    marginBottom: 10,
    color: 'black',
  },
  activateButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  activateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  viewSCIButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  viewSCIButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  historyItem: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  historyText: {
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  removeImageButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  removeImageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Uiscreendetalle;
