import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Asegúrate de que este import está correcto
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import FloatingButtonAdmin from './FloatingButtonAdmin'; // Asegúrate de que este componente esté bien importado

const Uiadministrador = () => {
  const [emergencias, setEmergencias] = useState([]);
  const navigation = useNavigation(); // Define correctamente el hook aquí

  useEffect(() => {
    const db = database();
    const emergenciasRef = db.ref('ultimasEmergencias').orderByChild('estado').equalTo('Activo');
    const onValueChange = emergenciasRef.on('value', (snapshot) => {
      const data = [];
      snapshot.forEach((childSnapshot) => {
        const val = childSnapshot.val();
        data.push({
          key: childSnapshot.key,
          title: val.Titulo, // Asegúrate de que los campos coincidan con los de Firebase
          city: val.ciudad,
          description: val.descripcion,
          ubicacion: val.ubicacion,
          type: val.tipo,
          state: val.estado,
          date: val.fecha,
          time: val.hora,
          imageUrl: val.imagen // Verifica que este campo sea correcto
        });
      });
      setEmergencias(data);
    });

    return () => emergenciasRef.off('value', onValueChange);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Uiscreendetalle', { item })} // Utiliza navigation aquí
    >
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title} - {item.city}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.cardInfo}>{item.type} - {item.state}</Text>
        <Text style={styles.cardInfo}>{item.date} - {item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
        <Text style={styles.headerText}>Con el Apoyo de</Text>
        <Image source={require('../imagenes/logov5.png')} style={styles.logo} />
      </View>
      <FlatList 
        data={emergencias}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.listContainer}
      />
      <FloatingButtonAdmin />
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
  logo: {
    height: 50,
    resizeMode: 'contain',
    marginTop: 20,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  cardInfo: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default Uiadministrador;
