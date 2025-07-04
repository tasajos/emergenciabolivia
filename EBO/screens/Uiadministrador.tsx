import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    Image, 
    SectionList, 
    FlatList, 
    TouchableOpacity, 
    SafeAreaView,
    StyleSheet,
    ActivityIndicator,
    ScrollView // Necesitamos ScrollView para el contenedor general
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import FloatingButtonAdmin from './FloatingButtonAdmin';

const Uiadministrador = () => {
  const [emergencias, setEmergencias] = useState([]);
  const [botones, setBotones] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // Tu lógica de carga de datos no cambia
  useEffect(() => {
    const emergenciasRef = database().ref('ultimasEmergencias').orderByChild('estado').equalTo('Activo');
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
      setEmergencias([{ title: "Emergencias Activas", data: data.reverse() }]);
      setLoading(false);
    });
    return () => emergenciasRef.off('value', onValueChange);
  }, []);

  useEffect(() => {
    const botonesRef = database().ref('/BotonesEmergencia');
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
      style={styles.card}
      onPress={() => navigation.navigate('Uiscreendetalle', { item: { ...item, key: item.key } })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={[styles.statusIndicator, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title} - {item.city}</Text>
        </View>
        <Text style={styles.cardDescription} numberOfLines={1}>{item.type}</Text>
        <Text style={styles.cardMeta}>{`${item.date} - ${item.time}`}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderItemBoton = ({ item }) => (
    <TouchableOpacity 
      style={styles.actionButton}
      onPress={() => navigation.navigate('DetalleOperacion', { item: { ...item, key: item.key } })}
    >
      <Image source={{ uri: item.imagen }} style={styles.actionButtonImage} />
      <Text style={styles.actionButtonText}>{item.nombre}</Text>
    </TouchableOpacity>
  );
  
  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeaderText}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header Fijo */}
      <View style={styles.topHeaderContainer}>
        <Text style={styles.supportText}>Con el Apoyo de</Text>
        <Image source={require('../imagenes/logov5.png')} style={styles.logo} />
      </View>
      
      {/* 2. ScrollView principal que envuelve el contenido que puede cambiar de tamaño */}
      <ScrollView>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" style={{ marginVertical: 40 }}/>
        ) : (
          <>
            {/* Este View contiene la lista de emergencias */}
            <View>
              <SectionList
                // LA CLAVE: Le damos una altura fija a la lista.
                // Si su contenido es mayor, tendrá su propio scroll interno.
                style={styles.emergencyListBox}
                sections={emergencias}
                renderItem={renderItemEmergencia}
                renderSectionHeader={renderSectionHeader}
                keyExtractor={(item) => item.key}
                ListEmptyComponent={<Text style={styles.emptyListText}>No hay emergencias activas.</Text>}
                // El `nestedScrollEnabled` ayuda a que el scroll funcione correctamente dentro de un ScrollView
                nestedScrollEnabled={true}
              />
            </View>
  
            {/* La sección de botones aparece justo debajo, como un bloque normal */}
            <View style={styles.buttonSectionContainer}>
              <Text style={styles.sectionHeaderText}>Sección de Emergencia</Text>
              <FlatList 
                data={botones}
                renderItem={renderItemBoton}
                keyExtractor={(item) => item.key}
                numColumns={2}
                scrollEnabled={false} // Esta lista no necesita scroll
              />
            </View>
          </>
        )}
      </ScrollView>

      {/* 3. El footer con la barra de navegación queda al final */}
      <FloatingButtonAdmin />
    </SafeAreaView>
  );
};

// --- Estilos Finales ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  topHeaderContainer: {
    paddingTop: 10,
    paddingBottom: 4,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  supportText: { fontSize: 14, color: '#666' },
  logo: { height: 40, resizeMode: 'contain', marginVertical: 4 },

  // ¡LA SOLUCIÓN ESTÁ AQUÍ!
  emergencyListBox: {
    // Le damos una altura fija. Si hay más de 4-5 tarjetas, esta caja tendrá scroll.
    // ¡Puedes cambiar este número para ajustar el tamaño de la caja!
    height: 500, 
  },

  buttonSectionContainer: {
    paddingBottom: 10,
    backgroundColor: '#F4F6F8',
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  emptyListText: {
    textAlign: 'center',
    padding: 40,
    color: '#666',
    fontSize: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    elevation: 3,
  },
  cardImage: { width: 100, height: 100, backgroundColor: '#E0E0E0' },
  cardContent: { padding: 12, flex: 1, justifyContent: 'center' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  statusIndicator: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1 },
  cardDescription: { fontSize: 14, color: '#666', marginBottom: 4 },
  cardMeta: { fontSize: 12, color: '#999' },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    height: 100,
    borderRadius: 12,
    padding: 10,
    elevation: 2,
  },
  actionButtonImage: { width: 40, height: 40, marginBottom: 8 },
  actionButtonText: { fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center' },
});

export default Uiadministrador;