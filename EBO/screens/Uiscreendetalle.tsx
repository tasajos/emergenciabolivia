import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import FloatingButtonAdmin from './FloatingButtonAdmin'; // Asegúrate de que este componente está correctamente importado

const Uiscreendetalle = ({ route }) => {
  const { item } = route.params;
  const coordinates = item.ubicacion ? item.ubicacion.split('query=').pop().split(',').map(Number) : null;

  const isValidCoordinates =
    coordinates &&
    coordinates.length === 2 &&
    !isNaN(coordinates[0]) &&
    !isNaN(coordinates[1]);

  if (!isValidCoordinates) {
    return (
      <View style={styles.container}>
        <Text>Las coordenadas de la ubicación no están disponibles o son inválidas.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Cabecera */}
        <View style={styles.header}>
          <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
          <Text style={styles.headerText}>Detalle de la Emergencia</Text>
          <Image source={require('../imagenes/logov5.png')} style={styles.logo} />
        </View>

        {/* Mapa con la ubicación */}
        {isValidCoordinates && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: coordinates[0],
                longitude: coordinates[1],
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: coordinates[0],
                  longitude: coordinates[1],
                }}
                title={item.title}
                description={item.description}
              />
            </MapView>
          </View>
        )}

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
    marginBottom: 10,
  },
  headerImage: {
    width: '100%',
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    color: '#424242',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logo: {
    height: 50,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  mapContainer: {
    height: 250,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginVertical: 20,
  },
  detailContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default Uiscreendetalle;
