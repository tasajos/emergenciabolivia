import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import FloatingButtonAdmin from './FloatingButtonAdmin'; // Asegúrate de que este componente está correctamente importado

const Uiscreendetalle = ({ route }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Cabecera */}
        <View style={styles.header}>
          <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
          <Text style={styles.headerText}>Detalle de la Emergencia</Text>
          <Image source={require('../imagenes/logov5.png')} style={styles.logo} />
        </View>

        {/* Imagen y detalles */}
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.detailContainer}>
          <Text style={styles.title}>{item.title} - {item.city}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.info}>{item.type} - {item.state}</Text>
          <Text style={styles.info}>{item.date} - {item.time}</Text>
        </View>
      </ScrollView>
      
      {/* Floating Button */}
      <FloatingButtonAdmin />
    </View>
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
  headerText: {
    fontSize: 16,
    color: '#424242',
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginLeft: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  details: {
    fontSize: 14,
    marginLeft: 10,
  },
  logo: {
    height: 50,
    resizeMode: 'contain',
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  detailContainer: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    marginBottom: 5,
  },

});

export default Uiscreendetalle;
