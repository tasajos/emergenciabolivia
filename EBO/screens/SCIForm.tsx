import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, PermissionsAndroid, ScrollView } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker } from 'react-native-maps';

type SCIFormRouteProp = RouteProp<{ params: { item: any } }, 'params'>;
type Props = {
  route: SCIFormRouteProp;
};

const SCIForm: React.FC<Props> = ({ route }) => {
  const { item } = route.params;
  const [nombreIncidente, setNombreIncidente] = useState('');
  const [fechaSCI, setFechaSCI] = useState('');
  const [ubicacionSCI, setUbicacionSCI] = useState<{ latitude: number | null; longitude: number | null; }>({
    latitude: null,
    longitude: null,
  });
  const [unidadComandoSCI, setUnidadComandoSCI] = useState('');
  const [comandanteIncidente, setComandanteIncidente] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    // Set the date and time to Bolivian time
    const now = new Date();
    const bolivianTime = now.toLocaleString('es-BO', { timeZone: 'America/La_Paz' });
    setFechaSCI(bolivianTime);
  }, []);

  const getLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Permiso de Ubicación",
          message: "Esta aplicación necesita acceso a tu ubicación.",
          buttonNeutral: "Preguntarme Luego",
          buttonNegative: "Cancelar",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            setUbicacionSCI({
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
        console.log("Permiso de ubicación denegado");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSubmit = async () => {
    if (!nombreIncidente || !fechaSCI || !ubicacionSCI.latitude || !ubicacionSCI.longitude || !unidadComandoSCI || !comandanteIncidente) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    try {
      const updateRef = firebase.database().ref(`/ultimasEmergencias/${item.key}`);
      await updateRef.update({
        nombreIncidente,
        fechaSCI,
        ubicacionSCI: `${ubicacionSCI.latitude}, ${ubicacionSCI.longitude}`,
        unidadComandoSCI,
        comandanteIncidente
      });

      Alert.alert('Formulario SCI 201', 'Formulario guardado con éxito.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el formulario');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Formulario SCI 201</Text>
      <Text style={styles.label}>Nombre del Incidente:</Text>
      <TextInput
        style={styles.input}
        value={nombreIncidente}
        onChangeText={setNombreIncidente}
        placeholder="Ingrese el nombre del incidente"
      />
      <Text style={styles.label}>Fecha y Hora:</Text>
      <TextInput
        style={styles.input}
        value={fechaSCI}
        editable={false}
      />
      <Text style={styles.label}>Ubicación:</Text>
      <View style={styles.locationContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={ubicacionSCI.latitude && ubicacionSCI.longitude ? `${ubicacionSCI.latitude}, ${ubicacionSCI.longitude}` : ''}
          editable={false}
          placeholder="Ubicación"
        />
        <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
          <Text style={styles.locationButtonText}>Obtener</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={{
            latitude: ubicacionSCI.latitude || -17.413977,
            longitude: ubicacionSCI.longitude || -66.165322,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
        >
          {ubicacionSCI.latitude && ubicacionSCI.longitude && (
            <Marker
              coordinate={{ latitude: ubicacionSCI.latitude, longitude: ubicacionSCI.longitude }}
              title="Tu Ubicación"
            />
          )}
        </MapView>
      </View>
      <Text style={styles.label}>Unidad al Mando del Incidente:</Text>
      <TextInput
        style={styles.input}
        value={unidadComandoSCI}
        onChangeText={setUnidadComandoSCI}
        placeholder="Ingrese el mando del incidente"
      />
      <Text style={styles.label}>Comandante del Incidente:</Text>
      <TextInput
        style={styles.input}
        value={comandanteIncidente}
        onChangeText={setComandanteIncidente}
        placeholder="Ingrese el comandante del incidente"
      />
      <Button title="Guardar" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  locationButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  mapContainer: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default SCIForm;
