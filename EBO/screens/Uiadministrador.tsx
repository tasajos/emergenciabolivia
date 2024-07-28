import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SectionList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import FloatingButtonAdmin from './FloatingButtonAdmin';

interface Emergencia {
  key: string;
  title: string;
  city: string;
  description: string;
  ubicacion: string;
  type: string;
  state: string;
  date: string;
  time: string;
  imageUrl: string;
}

const Uiadministrador = () => {
  const [emergencias, setEmergencias] = useState<{ title: string, data: Emergencia[] }[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const db = database();
    const emergenciasRef = db.ref('ultimasEmergencias').orderByChild('estado').equalTo('Activo');
    const onValueChange = emergenciasRef.on('value', (snapshot) => {
      const data: Emergencia[] = [];
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
        return false; // Retorna false para continuar con el siguiente childSnapshot
      });
      setEmergencias([{ title: "Emergencias Activas", data }]);
    });

    return () => emergenciasRef.off('value', onValueChange);
  }, []);

  const renderItem = ({ item }: { item: Emergencia }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Uiscreendetalle', { item: { ...item, key: item.key } })}
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

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <SectionList 
          sections={emergencias}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={item => item.key}
          contentContainerStyle={styles.sectionListContainer}
        />
      </View>
      <View style={styles.floatingButtonContainer}>
        <FloatingButtonAdmin />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  listContainer: {
    flex: 0.9, // 90% del espacio
  },
  sectionListContainer: {
    paddingHorizontal: 10,
    paddingBottom: 90,
  },
  floatingButtonContainer: {
    flex: 0.1, // 10% del espacio
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
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
    borderBottomLeftRadius: 10,
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
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
