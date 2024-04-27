import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, Button,Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import FloatingButtonAdmin from './FloatingButtonAdmin';
import { Picker } from '@react-native-picker/picker';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';

const Uiscreendetalle = ({ route }: { route: any }) => {
    const { item } = route.params;
    const coordinates = item.ubicacion ? item.ubicacion.split('query=').pop().split(',').map(Number) : null;
  
    const [subestado, setSubestado] = useState('');
    const [unidad, setUnidad] = useState('');
    const [telefonoResponsable, setTelefonoResponsable] = useState('');
  
    const isValidCoordinates =
      coordinates &&
      coordinates.length === 2 &&
      !isNaN(coordinates[0]) &&
      !isNaN(coordinates[1]);
  
      const handleUpdate = async () => {
        if (!item.key) {
          Alert.alert("Error", "No se encontró un identificador único para la actualización.");
          return;
        }
    
        try {
          const updateRef = firebase.database().ref(`/ultimasEmergencias/${item.key}`);
          await updateRef.update({
            subestado,
            unidad,
            telefonoResponsable
          });
    
          Alert.alert('Actualización exitosa', 'La información se ha actualizado correctamente.');
        } catch (error: any) {
          Alert.alert('Error al actualizar', error.message);
        }
      };
  
    if (!isValidCoordinates) {
      return (
        <View style={styles.container}>
          <Text>Las coordenadas de la ubicación no están disponibles o son inválidas.</Text>
        </View>
      );
    }

  return (
    <View style={styles.container}>
    <ScrollView style={styles.scrollView}>

        <View style={styles.header}>
          <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
          <Text style={styles.headerText}>Detalle de la Emergencia</Text>
          <Image source={require('../imagenes/logov5.png')} style={styles.logo} />
        </View>

        {isValidCoordinates && (
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

        <Image source={{ uri: item.imageUrl }} style={styles.image} />
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
            <Picker.Item label="Atendiendo" value="atendiendo" />
            <Picker.Item label="Rumbo a la emergencia" value="rumbo" />
            <Picker.Item label="Completado" value="completado" />
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

          <Button title="Actualizar Información" onPress={handleUpdate} />
        </View>
      </ScrollView>
      <FloatingButtonAdmin />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    marginBottom: 60,  // Espacio adicional para el FloatingButtonAdmin
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
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginVertical: 20,
  },
  detailContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 50,  // Added space at the bottom for better scrolling
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    marginBottom: 10,
  },
});

export default Uiscreendetalle;
