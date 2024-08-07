import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, PermissionsAndroid, ScrollView, Modal } from 'react-native';
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
  const [descripcionIncidente, setDescripcionIncidente] = useState('');
  const [accionesTomadas, setAccionesTomadas] = useState('');
  const [objetivosIncidente, setObjetivosIncidente] = useState('');
  const [recursosAsignados, setRecursosAsignados] = useState('');
  const [notasAdicionales, setNotasAdicionales] = useState('');
  const [isFormEditable, setIsFormEditable] = useState(true);
  const [showEssentialInfo, setShowEssentialInfo] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);

  // Estados para los modales de ubicación
  const [pcModalVisible, setPCModalVisible] = useState(false);
  const [baseModalVisible, setBaseModalVisible] = useState(false);
  const [acvModalVisible, setACVModalVisible] = useState(false);
  const [helipuertoModalVisible, setHelipuertoModalVisible] = useState(false);
  const [helipuerto1ModalVisible, setHelipuerto1ModalVisible] = useState(false);
  const [campamentoModalVisible, setCampamentoModalVisible] = useState(false);

  const [pcLocation, setPCLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [baseLocation, setBaseLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [acvLocation, setACVLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [helipuertoLocation, setHelipuertoLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [helipuerto1Location, setHelipuerto1Location] = useState<{ latitude: number; longitude: number } | null>(null);
  const [campamentoLocation, setCampamentoLocation] = useState<{ latitude: number; longitude: number } | null>(null);

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
        setDescripcionIncidente(data.descripcionIncidente || '');
        setAccionesTomadas(data.accionesTomadas || '');
        setObjetivosIncidente(data.objetivosIncidente || '');
        setRecursosAsignados(data.recursosAsignados || '');
        setNotasAdicionales(data.notasAdicionales || '');
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
        comandanteIncidente,
        descripcionIncidente,
        accionesTomadas,
        objetivosIncidente,
        recursosAsignados,
        notasAdicionales
      });

      Alert.alert('Formulario SCI 201', 'Formulario guardado con éxito.');
      setIsFormEditable(false);
      setShowEssentialInfo(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el formulario');
    }
  };

  const handleTransferCommand = () => {
    setModalVisible(true);
  };

  const handleSaveChanges = async () => {
    try {
      const updateRef = firebase.database().ref(`/ultimasEmergencias/${item.key}`);
      await updateRef.update({
        unidadComandoSCI,
        comandanteIncidente,
      });
      setModalVisible(false);
      setConfirmationModalVisible(true); // Mostrar el modal de confirmación
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar los cambios');
    }
  };

  const handleLocationPress = (type: string) => {
    switch (type) {
      case 'PC':
        setPCModalVisible(true);
        break;
      case 'Base':
        setBaseModalVisible(true);
        break;
      case 'ACV':
        setACVModalVisible(true);
        break;
      case 'Helipuerto':
        setHelipuertoModalVisible(true);
        break;
      case 'Helipuerto1':
        setHelipuerto1ModalVisible(true);
        break;
      case 'Campamento':
        setCampamentoModalVisible(true);
        break;
      default:
        break;
    }
  };

  const handleLocationSave = async (type: string) => {
    let location;
    let fieldName;
    switch (type) {
      case 'PC':
        location = pcLocation;
        fieldName = 'pcLocation';
        setPCModalVisible(false);
        break;
      case 'Base':
        location = baseLocation;
        fieldName = 'baseLocation';
        setBaseModalVisible(false);
        break;
      case 'ACV':
        location = acvLocation;
        fieldName = 'acvLocation';
        setACVModalVisible(false);
        break;
      case 'Helipuerto':
        location = helipuertoLocation;
        fieldName = 'helipuertoLocation';
        setHelipuertoModalVisible(false);
        break;
      case 'Helipuerto1':
        location = helipuerto1Location;
        fieldName = 'helipuerto1Location';
        setHelipuerto1ModalVisible(false);
        break;
      case 'Campamento':
        location = campamentoLocation;
        fieldName = 'campamentoLocation';
        setCampamentoModalVisible(false);
        break;
      default:
        break;
    }

    if (!location) {
      Alert.alert('Error', 'Por favor, seleccione una ubicación.');
      return;
    }

    try {
      const updateRef = firebase.database().ref(`/ultimasEmergencias/${item.key}`);
      await updateRef.update({
        [fieldName]: `${location.latitude}, ${location.longitude}`,
      });
      Alert.alert('Ubicación Registrada', 'Ubicación registrada con éxito.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar la ubicación.');
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
      <Text style={styles.label}>Descripción del Incidente:</Text>
      <TextInput
        style={styles.input}
        value={descripcionIncidente}
        onChangeText={setDescripcionIncidente}
        placeholder="Ingrese la descripción del incidente"
        editable={isFormEditable}
      />
      <Text style={styles.label}>Acciones Tomadas:</Text>
      <TextInput
        style={styles.input}
        value={accionesTomadas}
        onChangeText={setAccionesTomadas}
        placeholder="Ingrese las acciones tomadas"
        editable={isFormEditable}
      />
      <Text style={styles.label}>Objetivos del Incidente:</Text>
      <TextInput
        style={styles.input}
        value={objetivosIncidente}
        onChangeText={setObjetivosIncidente}
        placeholder="Ingrese los objetivos del incidente"
        editable={isFormEditable}
      />
      <Text style={styles.label}>Recursos Asignados:</Text>
      <TextInput
        style={styles.input}
        value={recursosAsignados}
        onChangeText={setRecursosAsignados}
        placeholder="Ingrese los recursos asignados"
        editable={isFormEditable}
      />
      <Text style={styles.label}>Notas Adicionales:</Text>
      <TextInput
        style={styles.input}
        value={notasAdicionales}
        onChangeText={setNotasAdicionales}
        placeholder="Ingrese notas adicionales"
        editable={isFormEditable}
      />
      {isFormEditable && <Button title="Guardar" onPress={handleSubmit} />}

      {showEssentialInfo && (
        <View style={styles.essentialInfoContainer}>
          <Text style={styles.essentialInfoHeader}>Información Importante del SCI</Text>
          <Text style={styles.registerText}>Registrar</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.orangeButton} onPress={() => handleLocationPress('PC')}>
              <Text style={styles.orangeButtonText}>PC</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orangeButton} onPress={() => handleLocationPress('Base')}>
              <Text style={styles.orangeButtonText}>B</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orangeButton} onPress={() => handleLocationPress('ACV')}>
              <Text style={styles.orangeButtonText}>ACV</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orangeButton} onPress={() => handleLocationPress('Helipuerto')}>
              <Text style={styles.orangeButtonText}>H</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orangeButton} onPress={() => handleLocationPress('Helipuerto1')}>
              <Text style={styles.orangeButtonText}>H1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orangeButton} onPress={() => handleLocationPress('Campamento')}>
              <Text style={styles.orangeButtonText}>C</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.redButton} onPress={handleTransferCommand}>
              <Text style={styles.redButtonText}>Transferir Mando</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modificar Comandante y Unidad al Mando</Text>
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={confirmationModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setConfirmationModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Transferencia de Mando Correcta</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setConfirmationModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modales para las ubicaciones */}
      <Modal
        visible={pcModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPCModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Puesto Comando (PC)</Text>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={{
                  latitude: ubicacionSCI.latitude || -17.413977,
                  longitude: ubicacionSCI.longitude || -66.165322,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={(e) => setPCLocation(e.nativeEvent.coordinate)}
              >
                {pcLocation && (
                  <Marker
                    coordinate={pcLocation}
                    title="Puesto Comando"
                  />
                )}
              </MapView>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={() => handleLocationSave('PC')}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setPCModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={baseModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBaseModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Base</Text>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={{
                  latitude: ubicacionSCI.latitude || -17.413977,
                  longitude: ubicacionSCI.longitude || -66.165322,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={(e) => setBaseLocation(e.nativeEvent.coordinate)}
              >
                {baseLocation && (
                  <Marker
                    coordinate={baseLocation}
                    title="Base"
                  />
                )}
              </MapView>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={() => handleLocationSave('Base')}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setBaseModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={acvModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setACVModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Área de Concentración de Víctimas (ACV)</Text>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={{
                  latitude: ubicacionSCI.latitude || -17.413977,
                  longitude: ubicacionSCI.longitude || -66.165322,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={(e) => setACVLocation(e.nativeEvent.coordinate)}
              >
                {acvLocation && (
                  <Marker
                    coordinate={acvLocation}
                    title="ACV"
                  />
                )}
              </MapView>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={() => handleLocationSave('ACV')}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setACVModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={helipuertoModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setHelipuertoModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Helipuerto</Text>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={{
                  latitude: ubicacionSCI.latitude || -17.413977,
                  longitude: ubicacionSCI.longitude || -66.165322,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={(e) => setHelipuertoLocation(e.nativeEvent.coordinate)}
              >
                {helipuertoLocation && (
                  <Marker
                    coordinate={helipuertoLocation}
                    title="Helipuerto"
                  />
                )}
              </MapView>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={() => handleLocationSave('Helipuerto')}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setHelipuertoModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={helipuerto1ModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setHelipuerto1ModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Helipuerto 1</Text>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={{
                  latitude: ubicacionSCI.latitude || -17.413977,
                  longitude: ubicacionSCI.longitude || -66.165322,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={(e) => setHelipuerto1Location(e.nativeEvent.coordinate)}
              >
                {helipuerto1Location && (
                  <Marker
                    coordinate={helipuerto1Location}
                    title="Helipuerto 1"
                  />
                )}
              </MapView>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={() => handleLocationSave('Helipuerto1')}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setHelipuerto1ModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={campamentoModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCampamentoModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Campamento</Text>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={{
                  latitude: ubicacionSCI.latitude || -17.413977,
                  longitude: ubicacionSCI.longitude || -66.165322,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={(e) => setCampamentoLocation(e.nativeEvent.coordinate)}
              >
                {campamentoLocation && (
                  <Marker
                    coordinate={campamentoLocation}
                    title="Campamento"
                  />
                )}
              </MapView>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={() => handleLocationSave('Campamento')}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setCampamentoModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    color: 'black',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    color: 'black',
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
    color: 'black',
  },
  registerText: {
    fontSize: 18,
    marginBottom: 10,
    color: 'black',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SCIForm;