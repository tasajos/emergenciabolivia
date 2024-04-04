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
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const Card = ({ title, date, imageSource }) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={imageSource} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDate}>{date}</Text>
        {/* ...otros elementos que forman parte de tu Card... */}
      </View>
    </View>
  );
};

const HorizontalCardList = ({ children }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.horizontalCardList}
    >
      {children}
    </ScrollView>
  );
};

const Homev2: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [appVersion, setAppVersion] = useState('');
  const [informacionUtil, setInformacionUtil] = useState([]);
  const [versionName, setVersionName] = useState('');

  useEffect(() => {
    const ref = database().ref('/informacionutil');
    const listener = ref.on('value', snapshot => {
      const fetchedData = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        fetchedData.push({
          nombre: data.nombre,
          imagen: data.imagen,
          fecha: data.fecha,
          id: childSnapshot.key // Usar el ID para identificar cada elemento de manera única
        });
      });
      setInformacionUtil(fetchedData);
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
      ref.off('value', listener);
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
            <Image source={require('../imagenes/instit2.png')} style={styles.logo} />
          </View>

          <Text style={styles.infoTitle2}>Voluntarios</Text>

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
  {informacionUtil.map(item => (
    <Card
      key={item.id}
      title={item.nombre}
      date={item.fecha}
      imageSource={{ uri: item.imagen }} // Asegúrate de que item.imagen sea una cadena válida
    />
  ))}
</HorizontalCardList>

          {/* Sección de Oportunidades de Voluntarios */}
          <Text style={styles.sectionTitle}>OPORTUNIDADES DE VOLUNTARIOS</Text>
          {/* Tarjetas de oportunidades aquí */}

          {/* Sección de ULTIMAS EMERGENCIAS */}
          <Text style={styles.sectionTitle}>ULTIMAS EMERGENCIAS</Text>
          {/* Tarjetas de oportunidades aquí */}
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
    marginBottom: 20,
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

  // Add other styles as needed
});

export default Homev2;
