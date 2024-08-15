import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Linking, Alert } from 'react-native';
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
  Voluntarios: undefined;
  kitset: undefined;
  OporVoluntarios: undefined;
  AlertaEmergenciaInforme: undefined;
};

type PreparacionEvento = {

  nombre: string;
  descripcion: string;
  imagen: string;
  id: string | null;
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
  estado: string;
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

type EmergenciaControl = {
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

const EmergencyAlertCard = ({ title, date, city, description, estado, onPress, isControlled }: { title: string, date: string, city: string, description: string, estado: string, onPress: () => void, isControlled?: boolean }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.emergencyCardContainer, isControlled && styles.controlledEmergencyCardContainer]}>
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

const ControlAlertCard = ({ title, date, city, description, estado, onPress, isControlled }: { title: string, date: string, city: string, description: string, estado: string, onPress: () => void, isControlled?: boolean }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.emergencyCardContainer, isControlled && styles.controlledEmergencyCardContainer]}>
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
  const [emergenciasActivas, setEmergenciasActivas] = useState<Emergencia[]>([]);
  const [emergenciasAtendidas, setEmergenciasAtendidas] = useState<EmergenciaControl[]>([]);
  const [preparacionEventos, setPreparacionEventos] = useState<PreparacionEvento[]>([]);


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
        return undefined;
      });
      setInformacionUtil(fetchedData);
    });

    const preparacionRef = database().ref('/preparate');
    const preparacionListener = preparacionRef.on('value', (snapshot) => {
      const fetchedPreparacionEventos: PreparacionEvento[] = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        
        if (data.estado === 'Activo') {
          fetchedPreparacionEventos.push({
         
          nombre: data.nombre,
          descripcion: data.descripcion,
          imagen: data.imagen,
          id: childSnapshot.key,
        });
      }
        return undefined;
      });
      setPreparacionEventos(fetchedPreparacionEventos);
    });



    const oportunidadesRef = database().ref('/oportunidadesVoluntariado');
    const oportunidadesListener = oportunidadesRef.on('value', (snapshot) => {
      const fetchedOportunidades: OportunidadVoluntariado[] = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.estado === 'Activo') {
          fetchedOportunidades.push({
            titulo: data.titulo,
            fecha: data.fecha,
            imagen: data.imagen,
            descripcion: data.descripcion,
            estado: data.estado,
            id: childSnapshot.key,
          });
        }
        return undefined;
      });
      setOportunidadesVoluntariado(fetchedOportunidades);
    });

    const emergenciasRef = database().ref('/ultimasEmergencias');
    const emergenciasListener = emergenciasRef.on('value', (snapshot) => {
      const fetchedEmergenciasActivas: Emergencia[] = [];
      const fetchedEmergenciasAtendidas: EmergenciaControl[] = [];
      const now = new Date();

      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const emergenciaDate = new Date(data.fecha);

        if (data.estado === 'Activo') {
          fetchedEmergenciasActivas.push({
            Titulo: data.Titulo,
            ciudad: data.ciudad,
            fecha: data.fecha,
            descripcion: data.descripcion,
            estado: data.estado,
            id: childSnapshot.key,
          });
        } 
          
      
        return undefined;
      });

      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        const emergenciaDate = new Date(data.fecha);

        if (data.estado === 'Controlado') {
          fetchedEmergenciasAtendidas.push({
            Titulo: data.Titulo,
            ciudad: data.ciudad,
            fecha: data.fecha,
            descripcion: data.descripcion,
            estado: data.estado,
            id: childSnapshot.key,
          });
        } 
          
      
        return undefined;
      });
      setEmergenciasActivas(fetchedEmergenciasActivas);
      setEmergenciasAtendidas(fetchedEmergenciasAtendidas);
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

    return () => {
      ref.off('value', listener);
      oportunidadesRef.off('value', oportunidadesListener);
      emergenciasRef.off('value', emergenciasListener);
      preparacionRef.off('value', preparacionListener);
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

  const onWhatsappchanelPress = () => {
    console.log("Intentando abrir WhatsApp...");
    const url = 'https://whatsapp.com/channel/0029VabE8nN7DAWtEBn6Pq2y';
    Linking.openURL(url).catch(err => {
      console.error('An error occurred', err);
      Alert.alert("Error", "Ocurrió un error al intentar abrir el enlace");
    });
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
            <Image source={require('../imagenes/logov5.png')} style={styles.logo} />
          </View>

          <Text style={styles.infoTitle2}>VOLUNTARIOS</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={onWhatsappchanelPress} style={styles.imageButton}>
                <Image source={require('../imagenes/wwchat.png')} style={styles.iconImage} />
              </TouchableOpacity>

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
                if (item.nombre === 'Eventos') {
                  navigation.navigate('Eventosv2');
                } else if (item.nombre === 'Kits') {
                  navigation.navigate('kitset');
                } if (item.nombre === 'Conviertete en Voluntario') {
                  navigation.navigate('Voluntarios');
                }
              }} />
            ))}
          </HorizontalCardList>

          {/* Sección de Oportunidades de Voluntarios */}
          <Text style={styles.sectionTitle}>OPORTUNIDADES DE VOLUNTARIADO</Text>
          <View style={styles.volunteerOpportunitiesContainer}>
            {oportunidadesVoluntariado.map((oportunidad) => (
              <VolunteerOpportunityCard key={oportunidad.id} title={oportunidad.titulo} date={oportunidad.fecha} description={oportunidad.descripcion} imageSource={{ uri: oportunidad.imagen }} onPress={() => {
                navigation.navigate('OporVoluntarios', { oportunidad: oportunidad });
              }} />
            ))}
          </View>

{/* Sección de Preparate de Eventos */}
          <Text style={styles.sectionTitle}>PREPÁRATE PARA LOS EVENTOS</Text>

          <View style={styles.preparateContainer}>
{preparacionEventos.map((evento) => (
    <TouchableOpacity
      key={evento.id}
      onPress={() => {
        if (evento.nombre === 'Sismo') {
          navigation.navigate('SismoEmer');
        } else {
          // Puedes agregar otra acción o redirección para otros eventos si es necesario
        }
      }}
    >
      <View style={styles.preparateCard}>
        <Image source={{ uri: evento.imagen }} style={styles.preparateCardImage} />
        <View style={styles.preparateCardContent}>
          <Text style={styles.preparateCardTitle}>{evento.nombre}</Text>
          <Text style={styles.preparateCardDescription}>{evento.descripcion}</Text>
        </View>
      </View>
    </TouchableOpacity>
  ))}
</View>



          {/* Sección de ULTIMAS EMERGENCIAS */}
          <Text style={styles.sectionTitle}>ULTIMAS EMERGENCIAS</Text>
          <View style={styles.emergencyAlertsContainer}>
            {emergenciasActivas.map((emergencia) => (
              <EmergencyAlertCard
                key={emergencia.id}
                title={emergencia.Titulo}
                city={emergencia.ciudad}
                date={emergencia.fecha}
                description={emergencia.descripcion}
                estado={emergencia.estado}
                onPress={() => {
                  navigation.navigate('AlertaEmergenciaInforme', { emergencia: emergencia });
                }}
              />
            ))}
          </View>

          {/* Sección de EMERGENCIAS ATENDIDAS */}
          <Text style={styles.sectionTitle}>EMERGENCIAS ATENDIDAS</Text>
          <View style={styles.emergencyAlertsContainer}>
            {emergenciasAtendidas.map((emergencia) => (
              <EmergencyAlertCard
                key={emergencia.id}
                title={emergencia.Titulo}
                city={emergencia.ciudad}
                date={emergencia.fecha}
                description={emergencia.descripcion}
                estado={emergencia.estado}
                isControlled={true}
                onPress={() => {
                  navigation.navigate('AlertaEmergenciaInforme', { emergencia: emergencia });
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
    height: 120,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageButton: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  iconImage: {
    width: 80,
    height: 80,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#424242',
    marginVertical: 10,
    marginLeft: 20,
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  cardContent: {
    padding: 10,
    justifyContent: 'space-around',
  },
  cardTitle: {
    fontWeight: 'bold',
    color: 'black',
  },
  cardDate: {
    color: 'gray',
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
  },
  detailsButton: {
  },
  detailsButtonText: {
    color: '#1e90ff',
  },
  VersionText: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#424242',
    marginVertical: 10,
    marginLeft: 20,
  },
  volunteerOpportunitiesContainer: {
    paddingHorizontal: 20,
  },
  volunteerCardContainer: {
    backgroundColor: '#f5f8fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 18,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  volunteerCardContent: {
    flex: 1,
  },
  volunteerCardTitle: {
    fontWeight: 'bold',
    color: '#14171a',
  },
  volunteerCardDate: {
    color: '#657786',
    fontSize: 12,
  },
  volunteerCardDescription: {
    color: '#657786',
    marginTop: 4,
    fontSize: 14,
  },
  emergencyCardContainer: {
    backgroundColor: '#fff4f4',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffcccb',
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlledEmergencyCardContainer: {
    backgroundColor: '#e6f9e6',
    borderColor: '#b3ffb3',
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
    color: '#d9534f',
    fontSize: 16,
  },
  emergencyCardDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  emergencyCardDescription: {
    fontSize: 14,
    color: '#333',
  },
  emergencyCardEstado: {
    fontSize: 14,
    color: '#333',
  },
  emergencyCardCity: {
    fontWeight: 'bold',
    color: '#d9534f',
    fontSize: 14,
    marginBottom: 4,
  },
  horizontalCardList: {
    marginBottom: 20,
  },
  emergencyAlertsContainer: {
    marginBottom: 20,
  },
  preparateContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  preparateCard: {
    backgroundColor: '#f5f8fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  preparateCardImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  preparateCardContent: {
    flex: 1,
  },
  preparateCardTitle: {
    fontWeight: 'bold',
    //color: '#14171a',
    color: 'black',
  },
  preparateCardDescription: {
    color: '#657786',
    marginTop: 4,
    fontSize: 14,
  },


});

export default Homev2;