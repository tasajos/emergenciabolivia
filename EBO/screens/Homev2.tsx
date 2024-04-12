import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import FloatingButtonBar from './FloatingButtonBar';
import DeviceInfo from 'react-native-device-info';
import database from '@react-native-firebase/database';

type RootStackParamList = {
  Homev2: undefined;
  MenuInicio: undefined;
  RecInfo: undefined;
  unidadesepr: {} | undefined;
  MapaHospitales: {} | undefined;
  Educacionepr: undefined;
  Ambientalistasepr: undefined;
  Animalistasepr: undefined;
  Ambulanciasepr: undefined;
  Eventosv2: undefined;
  kitset: undefined;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
};

type InformacionUtil = {
  nombre: string;
  imagen: string;
  fecha: string;
  id: string | null;
};

type OportunidadVoluntariado = {
  titulo: string;
  fecha: string;
  imagen: string;
  descripcion: string;
  id: string | null;
};

type Emergencia = {
  Titulo: string;
  ciudad: string;
  fecha: string;
  descripcion: string;
  estado: string;
  id: string | null;
};

const Card = ({ title, date, imageSource, onPress }: { title: string, date: string, imageSource: any, onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.cardContainer}>
        <Image source={imageSource} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDate}>{date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const VolunteerOpportunityCard = ({ title, date, imageSource, description, onPress }: { title: string, date: string, imageSource: any, description: string, onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.volunteerCardContainer}>
      <Image source={imageSource} style={styles.volunteerCardImage} />
      <View style={styles.volunteerCardContent}>
        <Text style={styles.volunteerCardTitle}>{title}</Text>
        <Text style={styles.volunteerCardDate}>{date}</Text>
        <Text style={styles.volunteerCardDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const EmergencyAlertCard = ({ title, date, city, description, estado, onPress }: { title: string, date: string, city: string, description: string, estado: string, onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.emergencyCardContainer}>
      <View style={styles.emergencyCardIconContainer}>
        <Image source={require('../imagenes/alerta.png')} style={styles.emergencyCardIcon} />
      </View>
      <View style={styles.emergencyCardContent}>
        <Text style={styles.emergencyCardTitle}>{title}</Text>
        <Text style={styles.emergencyCardCity}>{city}</Text>
        <Text style={styles.emergencyCardDate}>{date}</Text>
        <Text style={styles.emergencyCardDescription}>{description}</Text>
        <Text style={styles.emergencyCardEstado}>Estado: {estado}</Text>
      </View>
    </TouchableOpacity>
  );
};

const HorizontalCardList = ({ children }: { children: React.ReactNode }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalCardList}>
      {children}
    </ScrollView>
  );
};

const Homev2: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [appVersion, setAppVersion] = useState('');
  const [informacionUtil, setInformacionUtil] = useState<InformacionUtil[]>([]);
  const [versionName, setVersionName] = useState('');
  const [oportunidadesVoluntariado, setOportunidadesVoluntariado] = useState<OportunidadVoluntariado[]>([]);
  const [emergencias, setEmergencias] = useState<Emergencia[]>([]);

  useEffect(() => {
    const ref = database().ref('/informacionutil');
    const listener = ref.on('value', (snapshot) => {
        const fetchedData: InformacionUtil[] = [];
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          fetchedData.push({
            nombre: data.nombre,
            imagen: data.imagen,
            fecha: data.fecha,
            id: childSnapshot.key,
          });
          return undefined; // Añade esta línea
        });
        setInformacionUtil(fetchedData);
      });

    const oportunidadesRef = database().ref('/oportunidadesVoluntariado');
    const oportunidadesListener = oportunidadesRef.on('value', (snapshot) => {
        const fetchedOportunidades: OportunidadVoluntariado[] = [];
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          fetchedOportunidades.push({
            titulo: data.titulo,
            fecha: data.fecha,
            imagen: data.imagen,
            descripcion: data.descripcion,
            id: childSnapshot.key,
          });
          return undefined; // Añade esta línea
        });
        setOportunidadesVoluntariado(fetchedOportunidades);
      });
      

    const emergenciasRef = database().ref('/ultimasEmergencias');
    const emergenciasListener = emergenciasRef.on('value', (snapshot) => {
        const fetchedEmergencias: Emergencia[] = [];
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          fetchedEmergencias.push({
            Titulo: data.Titulo,
            ciudad: data.ciudad,
            fecha: data.fecha,
            descripcion: data.descripcion,
            estado: data.estado,
            id: childSnapshot.key,
          });
          return undefined; // Añade esta línea
        });
        setEmergencias(fetchedEmergencias);
      });

    setAppVersion(DeviceInfo.getReadableVersion());
    const getVersionName = async () => {
      const version = await DeviceInfo.getVersion();
      setVersionName(version);
    };
    getVersionName();

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Desmontar el listener
    return () => {
      // Desmontar ambos listeners
      ref.off('value', listener);
      oportunidadesRef.off('value', oportunidadesListener);
    };
  }, []);

  const onUnidadPress = (unidad: any) => {
    navigation.navigate('unidadesepr', { unidad });
  };

  const onHospitalesPress = (hosp: any) => {
    navigation.navigate('MapaHospitales', { hosp });
  };

  const onBomberosPress = () => {
    navigation.navigate('RecInfo');
  };

  const onEducacionPress = () => {
    navigation.navigate('Educacionepr');
  };

  const onAmbientalistasPress = () => {
    navigation.navigate('Ambientalistasepr');
  };

  const onAnimalistasPress = () => {
    navigation.navigate('Animalistasepr');
  };

  const onAmbulanciasPress = () => {
    navigation.navigate('Ambulanciasepr');
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Text style={styles.supportText}>Con el Apoyo de</Text>
            <Image source={require('../imagenes/logov4.png')} style={styles.logo} />
          </View>

          <Text style={styles.infoTitle2}>VOLUNTARIOS</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={onBomberosPress} style={styles.imageButton}>
                <Image source={require('../imagenes/Group129.png')} style={styles.iconImage} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onAmbulanciasPress} style={styles.imageButton}>
                <Image source={require('../imagenes/Group130.png')} style={styles.iconImage} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onHospitalesPress} style={styles.imageButton}>
                <Image source={require('../imagenes/Group131.png')} style={styles.iconImage} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onEducacionPress} style={styles.imageButton}>
                <Image source={require('../imagenes/educacion.png')} style={styles.iconImage} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onAmbientalistasPress} style={styles.imageButton}>
                <Image source={require('../imagenes/ambientalistas.png')} style={styles.iconImage} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onAnimalistasPress} style={styles.imageButton}>
                <Image source={require('../imagenes/animalistas.png')} style={styles.iconImage} />
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Sección de Información Útil */}
          <Text style={styles.sectionTitle}>INFORMACIÓN ÚTIL</Text>
          <HorizontalCardList>
            {informacionUtil.map((item) => (
              <Card key={item.id} title={item.nombre} date={item.fecha} imageSource={{ uri: item.imagen }} onPress={() => {
                // Lógica para determinar qué pantalla abrir
                if (item.nombre === 'Eventos') {
                  navigation.navigate('Eventosv2');
                } else if (item.nombre === 'Kits') {
                  navigation.navigate('kitset');
                }
              }} />
            ))}
          </HorizontalCardList>

          {/* Sección de Oportunidades de Voluntarios */}
          <Text style={styles.sectionTitle}>OPORTUNIDADES DE VOLUNTARIADO</Text>
          {/* Tarjetas de oportunidades aquí */}
          <View style={styles.volunteerOpportunitiesContainer}>
            {oportunidadesVoluntariado.map((oportunidad) => (
              <VolunteerOpportunityCard key={oportunidad.id} title={oportunidad.titulo} date={oportunidad.fecha} description={oportunidad.descripcion} imageSource={{ uri: oportunidad.imagen }} onPress={() => {
                // Define aquí tu lógica para el manejo del toque en la tarjeta
              }} />
            ))}
          </View>
          {/* Sección de ULTIMAS EMERGENCIAS */}
          <Text style={styles.sectionTitle}>ULTIMAS EMERGENCIAS</Text>
          {/* Tarjetas de ultimas emergencias aquí */}
          <View style={styles.emergencyAlertsContainer}>
  {emergencias
    .filter((emergencia) => emergencia.estado === 'Activo')
    .map((emergencia) => (
      <EmergencyAlertCard
        key={emergencia.id}
        title={emergencia.Titulo}
        city={emergencia.ciudad}
        date={emergencia.fecha}
        description={emergencia.descripcion}
        estado={emergencia.estado}
        onPress={() => {
          // Acciones al presionar la tarjeta de emergencia
        }}
      />
    ))}
</View>

          {/* Mostrar el versionName */}
          <Text style={styles.VersionText}>Version: {versionName}</Text>
        </ScrollView>
      )}
      <FloatingButtonBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    marginBottom: '16%',
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  supportText: {
    fontSize: 14,
    color: '#5C6979',
    marginBottom: 10,
  },
  logo: {
    height: 60,
    resizeMode: 'contain',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTitle2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  horizontalScroll: {
    height: 120, // Ajuste la altura según sea necesario
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row', // Asegúrese de que los botones estén alineados horizontalmente
    alignItems: 'center', // Alineación vertical de los botones
  },
  imageButton: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  iconImage: {
    width: 80, // Ajuste según el tamaño de sus imágenes
    height: 80,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#424242',
    marginVertical: 10,
    marginLeft: 20,
    // Estilos para los títulos de sección
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    elevation: 3, // Para Android - sombra ligera
    shadowColor: '#000', // Para iOS - sombra ligera
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardImage: {
    width: 100,
    height: 100,
    // Ajusta estos valores según tu diseño
  },
  cardContent: {
    padding: 10,
    justifyContent: 'space-around',
  },
  cardTitle: {
    fontWeight: 'bold',
    color: 'black', 
    // Ajusta estos estilos según tu diseño
  },
  cardDate: {
    color: 'gray',
    // Ajusta estos estilos según tu diseño
  },
  progressBarBackground: {
    backgroundColor: '#e0e0e0',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3b5998',
    // Ajusta estos estilos según tu diseño
  },
  detailsButton: {
    // Estilos para el botón de detalles
  },
  detailsButtonText: {
    color: '#1e90ff',
    // Ajusta estos estilos según tu diseño
  },
  VersionText: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#424242',
    marginVertical: 10,
    marginLeft: 20,
    // Estilos para los títulos de sección
  },
  volunteerOpportunitiesContainer: {
    paddingHorizontal: 20, // Puedes ajustar esto como necesites
  },
  volunteerCardContainer: {
    backgroundColor: '#f5f8fa', // Color de fondo claro como Twitter
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed', // Borde inferior sutil
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 18, // Aumenta para más redondez
    // Puedes también agregar sombra para elevar la tarjeta como en el diseño de Material
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  volunteerCardImage: {
    width: 60, // Más pequeño para un estilo más sutil
    height: 60,
    borderRadius: 30, // Circular como los avatares de Twitter
    marginRight: 10,
  },
  volunteerCardContent: {
    flex: 1,
  },
  volunteerCardTitle: {
    fontWeight: 'bold',
    color: '#14171a', // Color de texto casi negro
  },
  volunteerCardDate: {
    color: '#657786', // Color de texto gris para fechas y otros detalles
    fontSize: 12,
  },
  volunteerCardDescription: {
    color: '#657786', // Puedes usar el color que prefieras
    marginTop: 4,
    fontSize: 14,
    // Ajusta estos estilos para que se adapten al diseño de tu aplicación
  },
  emergencyCardContainer: {
    backgroundColor: '#fff4f4', // Un color de fondo claro similar al de las alertas de Facebook
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffcccb', // Un borde suave
    padding: 15,
    marginBottom: 10, // Espacio entre tarjetas
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyCardIconContainer: {
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyCardIcon: {
    width: 30,
    height: 30,
  },
  emergencyCardContent: {
    flex: 1,
  },
  emergencyCardTitle: {
    fontWeight: 'bold',
    color: '#d9534f', // Color rojo para llamar la atención
    fontSize: 16,
  },
  emergencyCardDate: {
    fontSize: 12,
    color: '#666', // Un color gris para la fecha
    marginBottom: 5,
  },
  emergencyCardDescription: {
    fontSize: 14,
    color: '#333', // Un color más oscuro para la descripción
  },
  emergencyCardEstado: {
    fontSize: 14,
    color: '#333', // Un color más oscuro para la descripción
  },
  emergencyCardCity: {
    fontWeight: 'bold',
    color: '#d9534f', // Puede ser el color de la alerta o el que mejor se ajuste a tu diseño
    fontSize: 14,
    marginBottom: 4, // Espacio debajo del nombre de la ciudad
  },
  // Add other styles as needed
  horizontalCardList: {
    marginBottom: 20, // Ajusta el margen inferior según sea necesario
  },
  emergencyAlertsContainer: {
    // Estilos para el contenedor de alertas de emergencia
    marginBottom: 20, // Ajusta el margen inferior según sea necesario
  },
});

export default Homev2;