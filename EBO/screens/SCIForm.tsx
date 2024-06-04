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
  const [ubicacionSCI, setUbicacionSCI] = useState<{ latitude: number | null; longitude: number | null; }>({
    latitude: null,
    longitude: null,
  });
  const [unidadComandoSCI, setUnidadComandoSCI] = useState('');
  const [comandanteIncidente, setComandanteIncidente] = useState('');
  const [isFormEditable, setIsFormEditable] = useState(true);
  const [showEssentialInfo, setShowEssentialInfo] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const updateRef = firebase.database().ref(`/ultimasEmergencias/${item.key}`);
      const snapshot = await updateRef.once('value');
      if (snapshot.exists()) {
        const data = snapshot.val();
        setNombreIncidente(data.nombreIncidente);
        setUbicacionSCI({
          latitude: parseFloat(data.ubicacionSCI.split(',')[0]),
          longitude: parseFloat(data.ubicacionSCI.split(',')[1]),
        });
        setUnidadComandoSCI(data.unidadComandoSCI);
        setComandanteIncidente(data.comandanteIncidente);
        setIsFormEditable(false);
        setShowEssentialInfo(true);
      }
    };

    fetchData();
  }, [item.key]);

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
    if (!nombreIncidente || !ubicacionSCI.latitude || !ubicacionSCI.longitude || !unidadComandoSCI || !comandanteIncidente) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    const now = new Date();
    const bolivianTime = now.toLocaleString('es-BO', { timeZone: 'America/La_Paz' });

    try {
      const updateRef = firebase.database().ref(`/ultimasEmergencias/${item.key}`);
      await updateRef.update({
        nombreIncidente,
        fechaSCI: bolivianTime,
        ubicacionSCI: `${ubicacionSCI.latitude}, ${ubicacionSCI.longitude}`,
        unidadComandoSCI,
        comandanteIncidente
      });

      Alert.alert('Formulario SCI 201', 'Formulario guardado con éxito.');
      setIsFormEditable(false);
      setShowEssentialInfo(true);
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
        editable={isFormEditable}
      />
      <Text style={styles.label}>Ubicación:</Text>
      <View style={styles.locationContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={ubicacionSCI.latitude && ubicacionSCI.longitude ? `${ubicacionSCI.latitude}, ${ubicacionSCI.longitude}` : ''}
          editable={false}
          placeholder="Ubicación"
        />
        {isFormEditable && (
          <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
            <Text style={styles.locationButtonText}>Obtener</Text>
          </TouchableOpacity>
        )}
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
        editable={isFormEditable}
      />
      <Text style={styles.label}>Comandante del Incidente:</Text>
      <TextInput
        style={styles.input}
        value={comandanteIncidente}
        onChangeText={setComandanteIncidente}
        placeholder="Ingrese el comandante del incidente"
        editable={isFormEditable}
      />
      {isFormEditable && <Button title="Guardar" onPress={handleSubmit} />}

      {showEssentialInfo && (
        <View style={styles.essentialInfoContainer}>
          <Text style={styles.essentialInfoHeader}>Información Esencial del SCI</Text>
          <Text style={styles.registerText}>Registrar</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.orangeButton}>
              <Text style={styles.orangeButtonText}>PC</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orangeButton}>
              <Text style={styles.orangeButtonText}>B</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orangeButton}>
              <Text style={styles.orangeButtonText}>ACV</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orangeButton}>
              <Text style={styles.orangeButtonText}>H</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orangeButton}>
              <Text style={styles.orangeButtonText}>C</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.redButton}>
              <Text style={styles.redButtonText}>Transferir Mando</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  essentialInfoContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    alignItems: 'center',
  },
  essentialInfoHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  registerText: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  orangeButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  orangeButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  redButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  redButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SCIForm;
