import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import FloatingButtonAdmin from './FloatingButtonAdmin';
import { Picker } from '@react-native-picker/picker';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
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
};

type EmergencyHistory = {
  subestado?: string;
  unidad?: string;
  telefonoResponsable?: string;
  timestamp: number;
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
        telefonoResponsable
      });
      await newHistoryRef.set({
        subestado,
        unidad,
        telefonoResponsable,
        timestamp: Date.now()
      });

      Alert.alert('Actualización exitosa', 'La información se ha actualizado correctamente.', [
        { text: "OK", onPress: () => navigation.push('Uiscreendetalle', { item: { ...item, key: item.key } }) }
      ]);
    } catch (error) {
      Alert.alert('Error al actualizar', error.message);
    }
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

          <Button title="Actualizar Información" onPress={handleUpdate} />

          {/* Display history */}
          {history.map((entry, index) => (
            <View key={index} style={styles.historyItem}>
              <Text>Subestado: {entry.subestado}</Text>
              <Text>Unidad: {entry.unidad}</Text>
              <Text>Teléfono: {entry.telefonoResponsable}</Text>
              <Text>Fecha: {new Date(entry.timestamp).toLocaleString()}</Text>
            </View>
          ))}
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
    marginBottom: 50,
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
  historyItem: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default Uiscreendetalle;