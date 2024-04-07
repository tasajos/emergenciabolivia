import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import FloatingButtonAdmin from './FloatingButtonAdmin';

type RootStackParamList = {
    Uiadministrador: undefined;
    Uiadmineventos: undefined; 
    Uiadminepr: undefined;
  Uiadminnotif: undefined;
  Uiadminalerta: undefined;


  };


  // Datos de ejemplo para las tarjetas
  const data: CardData[] = [
    { id: '1', title: 'Eventos', description: 'Crear Eventos en la App', screen: 'Uiadmineventos' },
    { id: '2', title: 'Unidades ', description: 'Crear Unidades EPR', screen: 'Uiadminepr' },
    { id: '3', title: 'Crear Alerta', description: 'Crear Alerta', screen: 'Uiadminalerta' },
  ];

interface CardData {
  id: string;
  title: string;
  description: string;
  screen: keyof RootStackParamList;
}
 

  const Uiadministrador = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const handleCardPress = (screen: keyof RootStackParamList) => {
      navigation.navigate(screen);
  };

  const renderItem = ({ item }: { item: CardData }) => (
    <TouchableOpacity
        style={styles.card}
        onPress={() => handleCardPress(item.screen)}
    >
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
    </TouchableOpacity>
  );



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
        <Text style={styles.headerText}>Con el Apoyo de </Text>
        <Image source={require('../imagenes/instit2.png')} style={styles.logo} />
        
      </View>
      <Text style={styles.description}>
        Selecciona del menu 
      </Text>
      
      <FlatList 
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <FloatingButtonAdmin navigation={navigation} />
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
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    color: '#424242',
  },
  backpackIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    margin: 20,
  },
  kitItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  itemCorrect: {
    backgroundColor: 'lightgreen',
  },
  itemIncorrect: {
    backgroundColor: 'salmon',
  },
  kitText: {
    fontSize: 16,
    color: '#424242',
  },
  logo: {
    height: 50,
    resizeMode: 'contain',
    marginTop: 20,
  },
  points: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 20,
    marginVertical: 10, // Espaciado vertical entre tarjetas
    // Sombras para darle un efecto elevado a las tarjetas
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4, // Sombras en Android
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
  },
});
export default Uiadministrador;