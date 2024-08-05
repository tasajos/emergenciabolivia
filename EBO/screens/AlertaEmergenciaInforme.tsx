import React, { useState, useEffect } from 'react';
import { View, Linking, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import database from '@react-native-firebase/database';
import FloatingButtonBar from './FloatingButtonBar';

type RootStackParamList = {
  AlertaEmergencia: undefined;
  AlertaEmergenciaInforme: { emergencia: EmergenciaVoluntariado | null };
};

type EmergenciaVoluntariado = {
  Titulo: string;
  fecha: string;
  imagen?: string;
  descripcion: string;
  id: string | null;
  ciudad?: string;
  tipo?: string;
  link?: string;
  historial?: { [key: string]: HistorialEntry }; // Tipo de datos para historial
};

type HistorialEntry = {
  necesitaAyuda: string;
  notas: string;
  subestado: string;
  telefonoResponsable: string;
  timestamp: number;
  unidad: string;
};

type NavigationType = StackNavigationProp<RootStackParamList, 'AlertaEmergenciaInforme'>;

const AlertaEmergenciaInforme = () => {
  const route = useRoute();
  const emergencia = route.params?.emergencia;
  const [detallesOportunidad, setDetallesOportunidad] = useState<EmergenciaVoluntariado | null>(emergencia);
  const navigation = useNavigation<NavigationType>();

  useEffect(() => {
    if (emergencia && emergencia.id) {
      const ref = database().ref(`/ultimasEmergencias/${emergencia.id}`);
      ref.on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          setDetallesOportunidad(prevState => ({ ...prevState, ...data }));
        }
      });

      return () => ref.off();
    }
  }, [emergencia]);

  if (!detallesOportunidad) {
    return <Text>Cargando...</Text>;
  }

  const unidades = detallesOportunidad.historial ? Object.values(detallesOportunidad.historial) : [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
          <Text style={styles.headerText}>Con el Apoyo de</Text>
          <Image source={require('../imagenes/logov5.png')} style={styles.logo} />
        </View>
        <View style={styles.postContainer}>
          <Image source={{ uri: detallesOportunidad.imagen || '../imagenes/noimagen.png' }} style={styles.postImage} />
          <Text style={styles.postTitle}>{detallesOportunidad.Titulo}</Text>
          <Text style={styles.postDescription}>{detallesOportunidad.descripcion}</Text>
          <Text style={styles.postTipo}>{detallesOportunidad.tipo}</Text>
          <Text style={styles.postBody}>{detallesOportunidad.ciudad}</Text>
          <Text style={styles.postDate}>{detallesOportunidad.fecha}</Text>
          
          {detallesOportunidad.link && (
            <TouchableOpacity onPress={() => Linking.openURL(detallesOportunidad.link)}>
              <Text style={styles.linkStyle}>Más información</Text>
            </TouchableOpacity>
          )}

          {/* Mostrar unidades del historial */}
          {unidades.length > 0 && (
            <View style={styles.unidadContainer}>
              <Text style={styles.unidadTitle}>Unidades Trabajando:</Text>
              {unidades.map((unidad, index) => (
                <View key={index} style={styles.unidadCard}>
                  <Text style={styles.unidadText}>Unidad: {unidad.unidad}</Text>
                  <Text style={styles.unidadText}>Necesita Ayuda: {unidad.necesitaAyuda}</Text>
                  <Text style={styles.unidadText}>Teléfono Responsable: {unidad.telefonoResponsable}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <FloatingButtonBar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  headerImage: {
    width: '80%',
    height: 60,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 18,
    color: '#4B4F56',
    marginTop: 10,
    fontWeight: '600',
  },
  logo: {
    height: 40,
    resizeMode: 'contain',
    marginTop: 10,
  },
  postContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  postTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#212529',
    marginTop: 8,
  },
  postDescription: {
    fontSize: 16,
    color: '#495057',
    marginTop: 4,
    marginBottom: 4,
  },
  postTipo: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 2,
  },
  postBody: {
    fontSize: 14,
    color: '#343A40',
    marginTop: 2,
  },
  postDate: {
    fontSize: 12,
    color: '#ADB5BD',
    marginTop: 2,
    marginBottom: 10,
  },
  linkStyle: {
    color: '#007BFF',
    marginTop: 4,
  },
  footer: {
    padding: 20,
    backgroundColor: '#F0F2F5',
  },
  unidadContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  unidadTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#212529',
    marginBottom: 10,
  },
  unidadCard: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  unidadText: {
    fontSize: 14,
    color: '#495057',
    marginTop: 4,
  },
});

export default AlertaEmergenciaInforme;