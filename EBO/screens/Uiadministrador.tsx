import React, { useState, useEffect } from 'react';
import { View, Text, Image, SectionList, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import FloatingButtonAdmin from './FloatingButtonAdmin';
import EstilosAdmin from './estilos/EstilosAdmin'; // Importar los estilos

const Uiadministrador = () => {
  const [emergencias, setEmergencias] = useState([]);
  const [botones, setBotones] = useState([]);
  const navigation = useNavigation();

  // Efecto para cargar las emergencias activas
  useEffect(() => {
    const db = database();
    const emergenciasRef = db.ref('ultimasEmergencias').orderByChild('estado').equalTo('Activo');
    const onValueChange = emergenciasRef.on('value', (snapshot) => {
      const data = [];
      snapshot.forEach((childSnapshot) => {
        const val = childSnapshot.val();
        data.push({
          key: childSnapshot.key || '',
          title: val.Titulo || '',
          city: val.ciudad || '',
          description: val.descripcion || '',
          ubicacion: val.ubicacion || '',
          type: val.tipo || '',
          state: val.estado || '',
          date: val.fecha || '',
          time: val.hora || '',
          imageUrl: val.imagen || ''
        });
        return false; 
      });
      setEmergencias([{ title: "Emergencias Activas", data }]);
    });

    return () => emergenciasRef.off('value', onValueChange);
  }, []);

  // Efecto para cargar los botones de emergencia
  useEffect(() => {
    const db = database();
    const botonesRef = db.ref('/BotonesEmergencia');
    const onValueChange = botonesRef.on('value', (snapshot) => {
      const data = [];
      snapshot.forEach((childSnapshot) => {
        const val = childSnapshot.val();
        data.push({
          key: childSnapshot.key || '',
          nombre: val.nombre || '',
          estado: val.estado || '',
          imagen: val.imagen || ''
        });
        return false; 
      });
      setBotones(data);
    });

    return () => botonesRef.off('value', onValueChange);
  }, []);

  const renderItemEmergencia = ({ item }) => (
    <TouchableOpacity 
      style={EstilosAdmin.card}
      onPress={() => navigation.navigate('Uiscreendetalle', { item: { ...item, key: item.key } })}
    >
      <Image source={{ uri: item.imageUrl }} style={EstilosAdmin.cardImage} />
      <View style={EstilosAdmin.cardContent}>
        <Text style={EstilosAdmin.cardTitle}>{item.title} - {item.city}</Text>
        <Text style={EstilosAdmin.cardDescription}>{item.description}</Text>
        <Text style={EstilosAdmin.cardInfo}>{item.type} - {item.state}</Text>
        <Text style={EstilosAdmin.cardInfo}>{item.date} - {item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderItemBoton = ({ item }) => (
    <TouchableOpacity 
      style={EstilosAdmin.botonEmergencia}
      onPress={() => navigation.navigate('DetalleOperacion', { item: { ...item, key: item.key } })}
    >
      <Image source={{ uri: item.imagen }} style={EstilosAdmin.botonImagen} />
      <Text style={EstilosAdmin.botonTexto}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={EstilosAdmin.header}>
      <Text style={EstilosAdmin.headerText}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={EstilosAdmin.container}>
      <View style={EstilosAdmin.headerContainer}>
        <Text style={EstilosAdmin.supportText}>Con el Apoyo de</Text>
        <Image source={require('../imagenes/logov5.png')} style={EstilosAdmin.logo} />
      </View>

      <View style={EstilosAdmin.listContainer}>
        <SectionList 
          sections={emergencias}
          renderItem={renderItemEmergencia}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={item => item.key}
          contentContainerStyle={EstilosAdmin.sectionListContainer}
        />
      </View>

      <View style={EstilosAdmin.listContainer}>
        <Text style={EstilosAdmin.headerText}>Sección de Emergencia</Text>
        <FlatList 
          data={botones}
          renderItem={renderItemBoton}
          keyExtractor={item => item.key}
          contentContainerStyle={EstilosAdmin.flatListContainer}
          numColumns={2} // Para mostrar dos botones por fila
        />
      </View>

      <View style={EstilosAdmin.floatingButtonContainer}>
        <FloatingButtonAdmin />
      </View>
    </SafeAreaView>
  );
};

export default Uiadministrador;