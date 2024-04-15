// Eventosv2.tsx
import React, { useState, useEffect  } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, SafeAreaView, Linking, ActivityIndicator,Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import FloatingButtonBar from './FloatingButtonBar';

type Evento = {
  key: string;
  imagen: string;
  descripcion: string;
  fecha: string;
  nombre: string;
  inscripcion: string;
  link: string;
  ciudad: string;
  estado: string;
};

type EventoCardProps = {
  evento: Evento;
};

const EventoCard: React.FC<EventoCardProps> = ({ evento }) => {
    const handlePress = (link?: string) => {
        if (!link) {
          Alert.alert("Error", "El enlace no está disponible o es inválido.");
          return; // Salir si no hay un enlace válido
        }
    
        // Intentar abrir el enlace
        Linking.openURL(link).catch(() => {
          Alert.alert("Error", "No se pudo abrir el enlace. Por favor, verifica que sea correcto.");
        });
      };
  return (
    <View>
      <TouchableOpacity style={styles.cardContainer} onPress={() => handlePress(evento.link)}>
        <Image style={styles.cardImage} source={{ uri: evento.imagen }} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{evento.nombre}</Text>
          <Text style={styles.cardInfo}>{evento.descripcion}</Text>
          <Text style={styles.cardInfo}>{evento.ciudad}</Text>
          <Text style={styles.cardInfo} onPress={() => handlePress(evento.inscripcion)}>
            {evento.fecha}
          </Text>
          {/* Botón para aplicar como voluntario */}
          <TouchableOpacity style={styles.applyButton} onPress={() => handlePress(evento.link)}>
            <Text style={styles.applyButtonText}>Registrate</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

type RootStackParamList = {
  Eventos: undefined;
  // ... otros parámetros de tus rutas
};

const Eventosv2: React.FC = () => {
  const [evts, setEvts] = useState<Evento[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = database().ref('/eventos');
    setLoading(true);
    const onValueChange = ref.on('value', (snapshot) => {
      const data = snapshot.val() ?? {};
      const evtsList = Object.keys(data).map(key => ({
        key: key,
        ...data[key]
      }));
      setEvts(evtsList);
      setLoading(false);
    });
    
    return () => ref.off('value', onValueChange); // Desuscribirse del listener al desmontar el componente
  }, []);

  if (loading) {
    // Si está cargando, muestra el spinner
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
        <Text style={styles.headerText}>Con el Apoyo de</Text>
        <Image source={require('../imagenes/logov5.png')} style={styles.logo} />
      </View>
      <FlatList
        data={evts.filter((evento) => evento.estado === 'Activo')}
        renderItem={({ item }) => <EventoCard evento={item} />}
        keyExtractor={(item) => item.key}
        style={styles.eventList}
      />

      <View style={styles.floatingButtonBarContainer}>
        <FloatingButtonBar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}; 


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff', // Suponiendo que el fondo es blanco
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    headerImage: {
      width: '80%',
      height: 60, // Altura de tu curva
      resizeMode: 'contain',
    },
    headerText: {
      fontSize: 16,
      //fontWeight: 'bold',
      color: '#424242',
      marginTop: 20, // Ajustar según tu diseño
    },
    
    eventList: {
        flex: 1, // Asegúrate de que la FlatList use todo el espacio disponible
      },
      content: {
        flex: 0.9, // El 90% del espacio para el contenido
      },
      floatingButtonBarContainer: {
        flex: 0.1, // El 10% del espacio para el FloatingButtonBar
        justifyContent: 'center', // Centrar el botón verticalmente
        paddingHorizontal: 10, // Agrega padding si es necesario
        backgroundColor: 'transparent', // Un color de fondo para que resalte
      },
    
    row: {
      flex: 1,
      justifyContent: 'space-around',
    },
    logo: {
      height: 50, // Ajusta la altura de tu logo
      resizeMode: 'contain', // Contiene la imagen dentro del espacio disponible sin deformarla
      marginTop: 20, // Ajusta el margen superior si es necesario
    },
    cardContainer: {
        backgroundColor: '#ffffff', // Fondo blanco para las tarjetas
        borderRadius: 10, // Bordes redondeados
        margin: 10,
        shadowColor: '#000', // Sombra para la tarjeta
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3, // Elevación para Android
      },
      cardImage: {
        width: '100%', // La imagen ocupa el ancho completo de la tarjeta
        height: 200, // Altura fija para la imagen
        borderTopLeftRadius: 10, // Redondea solo las esquinas superiores
        borderTopRightRadius: 10,
      },
      cardContent: {
        padding: 10, // Espaciado interior para el contenido de la tarjeta
      },
      cardTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5, // Espacio debajo del título
      },
      cardInfo: {
        fontSize: 14,
        color: 'gray', // Color gris para la descripción
        marginBottom: 10, // Espacio debajo de la descripción
      },
      applyButton: {
        backgroundColor: '#E1F5FE', // Color de fondo para el botón de aplicar
        padding: 10,
        borderRadius: 20, // Bordes redondeados para el botón
        alignItems: 'center',
        justifyContent: 'center',
      },
      applyButtonText: {
        color: '#039BE5', // Color para el texto del botón
        fontWeight: 'bold',
      },
     

      linkStyle: {
        color: '#0645AD', // Color típico de enlace
        textDecorationLine: 'underline', // Subraya el texto para parecer un enlace
        fontSize: 14,
        marginTop: 5, // Espacio adicional si es necesario
      },
      spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },

    // ... Agrega más estilos según sea necesario
  });
  export default Eventosv2;