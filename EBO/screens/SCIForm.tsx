import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/database';

type SCIFormRouteProp = RouteProp<{ params: { item: any } }, 'params'>;
type Props = {
  route: SCIFormRouteProp;
};

const SCIForm: React.FC<Props> = ({ route }) => {
  const { item } = route.params;
  const [incidentName, setIncidentName] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [incidentCommand, setIncidentCommand] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!incidentName || !dateTime || !location || !incidentCommand) {
      Alert.alert('Error', 'Por favor, complete todos los campos');
      return;
    }

    try {
      const updateRef = firebase.database().ref(`/ultimasEmergencias/${item.key}`);
      await updateRef.update({
        incidentName,
        dateTime,
        location,
        incidentCommand
      });

      Alert.alert('Formulario SCI 201', 'Formulario guardado con éxito.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el formulario');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Formulario SCI 201</Text>
      <Text style={styles.label}>Nombre del Incidente:</Text>
      <TextInput
        style={styles.input}
        value={incidentName}
        onChangeText={setIncidentName}
        placeholder="Ingrese el nombre del incidente"
      />
      <Text style={styles.label}>Fecha y Hora:</Text>
      <TextInput
        style={styles.input}
        value={dateTime}
        onChangeText={setDateTime}
        placeholder="Ingrese la fecha y hora"
      />
      <Text style={styles.label}>Ubicación:</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Ingrese la ubicación"
      />
      <Text style={styles.label}>Mando del Incidente:</Text>
      <TextInput
        style={styles.input}
        value={incidentCommand}
        onChangeText={setIncidentCommand}
        placeholder="Ingrese el mando del incidente"
      />
      <Button title="Guardar" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default SCIForm;
