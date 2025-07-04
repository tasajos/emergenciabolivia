import React, { useState, useEffect } from 'react';
import { View, Text, Image, SectionList, FlatList, TouchableOpacity, SafeAreaView,
    StyleSheet,ActivityIndicator ,Modal, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import FloatingButtonAdmin from './FloatingButtonAdmin';
// Necesitaremos un ícono. Asegúrate de tener react-native-vector-icons instalado
import Icon from 'react-native-vector-icons/Ionicons';

const LIST_FIXED_HEIGHT = 400; // MEJORA: Definimos la altura en una constante para reutilizarla

const Uiadministrador = () => {
  const [emergencias, setEmergencias] = useState([]);
  const [botones, setBotones] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // --- MEJORA: Estados para el indicador de scroll ---
  const [isListScrollable, setIsListScrollable] = useState(false);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
 const [isGuardiaModalVisible, setGuardiaModalVisible] = useState(false);
  const [unidad, setUnidad] = useState('');
  const [personal, setPersonal] = useState('');
  const [vehiculos, setVehiculos] = useState({
    camioneta: false,
    ambulancia: false,
    carroBomba: false,
    otro: false,
  });


  // --- MEJORA: Estados para el nuevo modal de feedback ---
  const [isFeedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');



  // Tu lógica de carga de datos no cambia
  useEffect(() => {
    //... (tu useEffect para emergencias, sin cambios)
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
    //... (tu useEffect para botones, sin cambios)
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
  
  // --- MEJORA: Funciones para manejar el scroll ---
  const handleContentSizeChange = (contentWidth, contentHeight) => {
    // Si la altura del contenido es mayor que la altura fija de la caja, la lista es desplazable
    setIsListScrollable(contentHeight > LIST_FIXED_HEIGHT);
  };
  
  const handleScroll = (event) => {
    // Si el usuario se ha desplazado un poco desde la parte superior, ocultamos el indicador
    if (event.nativeEvent.contentOffset.y > 10) {
      setHasUserScrolled(true);
    }
  };


 const handleGuardiaSubmit = async () => {
    if (!unidad || !personal) {
      Alert.alert('Campos vacíos', 'Por favor, completa la unidad y el personal.');
      return;
    }
    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'Debes estar autenticado.');
      return;
    }

    const guardiaData = {
      userId: currentUser.uid,
      email: currentUser.email,
      unidad: unidad,
      personal: personal,
      vehiculos: vehiculos,
      timestamp: database.ServerValue.TIMESTAMP,
    };

    try {
      const newGuardiaRef = database().ref('/guardiasActivas').push();
      await newGuardiaRef.set(guardiaData);

      // MEJORA: Usamos el nuevo modal en lugar de Alert
      setGuardiaModalVisible(false); // Primero cerramos el modal del formulario
      setFeedbackMessage('¡Guardia Registrada con Éxito!');
      setFeedbackModalVisible(true); // Luego abrimos el modal de éxito

      // Limpiar el formulario para la próxima vez
      setUnidad('');
      setPersonal('');
      setVehiculos({ camioneta: false, ambulancia: false, carroBomba: false, otro: false });

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo registrar la guardia.');
    }
  };


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
      onPress={() => {
        // MEJORA: Lógica condicional para el botón de emergencia
        if (item.nombre.toLowerCase() === 'emergencia') {
          navigation.navigate('AlertaWhatsApp'); // Navega a la nueva pantalla
        } else {

          if (item.nombre.toLowerCase().includes('guardia')) {
        setGuardiaModalVisible(true); // Abre el nuevo modal
      } else {
        navigation.navigate('DetalleOperacion', { item: { ...item, key: item.key } });
      }
          
        }
      }}
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
      <View style={styles.topHeaderContainer}>
        <Text style={styles.supportText}>Con el Apoyo de</Text>
        <Image source={require('../imagenes/logov5.png')} style={styles.logo} />
      </View>
      
      {/* MEJORA: Envolvemos la lista en un View para poder posicionar el ícono sobre ella */}
      <View style={styles.listWrapper}>
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" style={{ height: LIST_FIXED_HEIGHT }}/>
        ) : (
          <SectionList
            style={styles.emergencyList}
            sections={emergencias}
            renderItem={renderItemEmergencia}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={(item) => item.key}
            ListEmptyComponent={<Text style={styles.emptyListText}>No hay emergencias activas.</Text>}
            // --- MEJORA: Propiedades para detectar el scroll ---
            onContentSizeChange={handleContentSizeChange}
            onScroll={handleScroll}
            scrollEventThrottle={16} // Para que el evento onScroll no se dispare con demasiada frecuencia
          />
        )}
        
        {/* MEJORA: Renderizado condicional del ícono indicador */}
        {isListScrollable && !hasUserScrolled && (
            <View style={styles.scrollIndicator}>
        <Image
            source={require('../imagenes/flecha-hacia-abajo.png')}
            style={styles.scrollIndicatorIcon}
        />
    </View>
        )}
      </View>
  
      <View style={styles.buttonSectionContainer}>
        <Text style={styles.sectionHeaderText}>Sección de Emergencia</Text>
        <FlatList 
          data={botones}
          renderItem={renderItemBoton}
          keyExtractor={(item) => item.key}
          numColumns={2}
        />
      </View>

      <FloatingButtonAdmin />


{/* --- MEJORA: Modal para registrar la guardia --- */}
 {/* --- CÓDIGO DEL MODAL DE GUARDIA (CON CHECKBOX MEJORADO) --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isGuardiaModalVisible}
        onRequestClose={() => setGuardiaModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Registrar Guardia</Text>
            
            <Text style={styles.label}>Unidad / Estación:</Text>
            <TextInput style={styles.input} placeholder="Ej: Estación Central, UGR" value={unidad} onChangeText={setUnidad}/>
            
            <Text style={styles.label}>Personal Disponible:</Text>
            <TextInput style={styles.input} placeholder="Ej: 5" value={personal} onChangeText={setPersonal} keyboardType="numeric"/>
            
            <Text style={styles.label}>Vehículos Disponibles:</Text>
            {Object.keys(vehiculos).map((key) => (
              <TouchableOpacity 
                key={key} 
                style={styles.checkboxContainer} 
                onPress={() => setVehiculos(prev => ({ ...prev, [key]: !prev[key] }))}
              >
                {/* MEJORA: Checkbox con mejor estilo */}
                <View style={[styles.checkbox, vehiculos[key] && styles.checkboxChecked]}>
                  {vehiculos[key] && <Icon name="checkmark" size={18} color="white" />}
                </View>
                <Text style={styles.checkboxLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              </TouchableOpacity>
            ))}
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#6c757d' }]} onPress={() => setGuardiaModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#007BFF' }]} onPress={handleGuardiaSubmit}>
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MEJORA: NUEVO MODAL PARA FEEDBACK DE ÉXITO --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isFeedbackModalVisible}
        onRequestClose={() => setFeedbackModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.feedbackModalContainer}>
                <View style={styles.feedbackIconContainer}>
                <Image
                source={require('../imagenes/exito.png')}
                style={styles.feedbackIcon}
                />
                </View>
                <Text style={styles.feedbackModalTitle}>¡Listo!</Text>
                <Text style={styles.feedbackModalMessage}>{feedbackMessage}</Text>
                <TouchableOpacity
                    style={styles.feedbackModalButton}
                    onPress={() => setFeedbackModalVisible(false)}
                >
                    <Text style={styles.modalButtonText}>Cerrar</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },

  // --- Estilos para el Modal de Guardia ---
modalOverlay: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContainer: {
  width: '90%',
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 20,
  elevation: 5,
},
modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 20,
  textAlign: 'center',
},
label: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
  alignSelf: 'flex-start',
  marginBottom: 8,
},
input: {
  width: '100%',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  marginBottom: 16,
  fontSize: 16,
},
checkboxContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},
checkboxLabel: {
  marginLeft: 10,
  fontSize: 16,
},
modalButtonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
  width: '100%',
},
modalButton: {
  borderRadius: 8,
  padding: 12,
  flex: 1,
  marginHorizontal: 5,
  alignItems: 'center',
},
modalButtonText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 16,
},
  topHeaderContainer: {
    paddingTop: 10,
    paddingBottom: 5,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  supportText: { fontSize: 14, color: '#666' },
  logo: { height: 40, resizeMode: 'contain', marginVertical: 4 },
  
  // MEJORA: Contenedor para la lista y el ícono
  listWrapper: {
    height: LIST_FIXED_HEIGHT, // Usamos la constante aquí
  },
  emergencyList: {
    // La lista ocupa todo el espacio de su contenedor
    flex: 1,
  },
  // MEJORA: Estilo para el ícono indicador de scroll
  scrollIndicator: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
    opacity: 0.7,
  },

  buttonSectionContainer: {
    paddingBottom: 15,
    backgroundColor: '#F4F6F8',
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
  },
  emptyListText: {
    textAlign: 'center',
    padding: 40,
    color: '#666',
    fontSize: 16,
  },
  scrollIndicatorIcon: {
    width: 24, // Puedes ajustar el ancho
    height: 24, // Puedes ajustar el alto
},

 // --- MEJORA: Nuevos estilos para los Checkboxes ---
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007BFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#007BFF',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  
  // --- MEJORA: Nuevos estilos para el Modal de Feedback ---
  feedbackModalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingTop: 0,
    alignItems: 'center',
    overflow: 'hidden', // para que el fondo del ícono no se salga de los bordes redondeados
  },
  feedbackIconContainer: {
    backgroundColor: '#28a745', // Color de éxito
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  feedbackModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  feedbackModalMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  feedbackModalButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 12,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    elevation: 3,
  },
  cardImage: { width: 100, height: 100, backgroundColor: '#E0E0E0', borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
  cardContent: { padding: 5, flex: 1, justifyContent: 'center' },
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
    marginVertical: 4,
    height: 100,
    borderRadius: 12,
    padding: 10,
    elevation: 2,
  },
  actionButtonImage: { width: 40, height: 40, marginBottom: 8 },
  actionButtonText: { fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center' },
});

export default Uiadministrador;