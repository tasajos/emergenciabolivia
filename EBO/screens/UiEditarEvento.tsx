import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import database from '@react-native-firebase/database';
import { StackNavigationProp } from '@react-navigation/stack';
import FloatingButtonAdmin from './FloatingButtonAdmin';

type RootStackParamList = {
  Uiadminevento: undefined;
  UiEditarEvento: { id: string };
};

type UiEditarAlertaRouteProp = RouteProp<RootStackParamList, 'UiEditarEvento'>;
type UiEditarAlertaNavigationProp = StackNavigationProp<RootStackParamList, 'UiEditarEvento'>;

const UiEditarEvento = () => {
  const route = useRoute<UiEditarAlertaRouteProp>();
  const navigation = useNavigation<UiEditarAlertaNavigationProp>();
  const { id } = route.params;
  const [nombre, setTitulo] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [estado, setEstado] = useState('Activo');

  useEffect(() => {
    const alertaRef = database().ref(`/eventos/${id}`);
    alertaRef.on('value', (snapshot) => {
      const data = snapshot.val();
      setTitulo(data.nombre);
      setCiudad(data.ciudad);
      setDescripcion(data.descripcion);
      setEstado(data.estado);
      setFecha(data.fecha);
    });

    return () => alertaRef.off('value');
  }, [id]);

  const handleUpdate = () => {
    const alertaRef = database().ref(`/eventos/${id}`);
    alertaRef.update({ estado });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Editar Evento</Text>
      <Text style={styles.label}>Nombre: {nombre}</Text>
      <Text style={styles.label}>Ciudad: {ciudad}</Text>
      <Text style={styles.label}>Descripción: {descripcion}</Text>
      <Text style={styles.label}>Fecha: {fecha}</Text>
      <Picker
        selectedValue={estado}
        onValueChange={(itemValue) => setEstado(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Activo" value="Activo" />
        <Picker.Item label="Vencido" value="Vencido" />
      </Picker>
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Actualizar</Text>
      </TouchableOpacity>
      <FloatingButtonAdmin navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  picker: {
    width: '80%',
    height: 50,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UiEditarEvento;