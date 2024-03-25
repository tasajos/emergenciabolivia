import React, { useState ,useCallback ,useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image,ImageBackground ,FlatList} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import FloatingButtonBar from './FloatingButtonBar';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';



type RootStackParamList = {
  Home: undefined;
  RecInfo: undefined;
  DetalleUnidad: { unidad: any };
  kitset: undefined;
  eventoscreen: undefined;
  Amscreen: undefined;
  Ifscreen: undefined;
  Iescreen: undefined;
  Dscreen: undefined;
  Rascreen: undefined;
  Rscreen: undefined;
  unidadesepr: { unidad: any }; // Asegúrate de agregar esta línea
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
};

type Unidad = {
  name: string;
  image: { uri: string };
  ciudad?: string;
  telefono: string;
facebook: string;
web: string;
  // Puedes agregar más propiedades aquí si necesitas
};

const MenuInicio = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'La Paz', value: 'La Paz'},
    {label: 'Cochabamba', value: 'Cochabamba'},
    {label: 'Santa Cruz', value: 'Santa Cruz'},
    {label: 'Beni', value: 'Beni'},
    {label: 'Tarija', value: 'Tarija'},
    {label: 'Oruro', value: 'Oruro'},
    {label: 'Potosi', value: 'Potosi'},
    // Agrega más ciudades aquí
]);

const [unidadesFiltradas, setUnidadesFiltradas] = useState<Unidad[]>([]);

const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();


useEffect(() => {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('Mensaje FCM en primer plano:', remoteMessage);
  });


  if (searchQuery.trim() !== '' && value) {
    buscarUnidades();
  }
}, [searchQuery, value]);

const buscarUnidades = () => {
  

  const ref = database().ref('/epr');
  ref.once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      const filtradas = Object.keys(data)
        .filter((key) => {
          const nombre = data[key].nombre.toLowerCase();
          const ciudad = data[key].ciudad || '';
          const busqueda = searchQuery.toLowerCase();
          return nombre.includes(busqueda) && ciudad === value;
        })
        .map((key) => ({
          name: data[key].nombre,
          image: { uri: data[key].imagen || 'default_image_uri' }, // Asegúrate de tener una URI de imagen por defecto
          telefono: data[key].telefono || '',
          facebook: data[key].facebook || '',
          web: data[key].web || ''
        }));
      setUnidadesFiltradas(filtradas);
    })
    .catch((error) => {
      console.error('Error al recuperar los datos:', error);
    });
};

    const clearSearch = () => {
      setSearchQuery('');
    };

  
    const onUnidadPress = (unidad: any) => {
      navigation.navigate('unidadesepr', { unidad });
    };

   
    const onBomberosPress = () => {
        navigation.navigate('RecInfo');
      };

      const renderHeader = () => (
        <>
          <View style={styles.curveSection}>
            <Image source={require('../imagenes/top.png')} style={styles.curve} />
          </View>
          <View style={styles.supportSection}>
            <Image source={require('../imagenes/tsflo1.png')} style={styles.logo} />
            <Text style={styles.supportText}>Con el Apoyo de Tunari sin Fuego</Text>
          </View>


          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onBomberosPress} style={styles.imageButton}>
              <Image source={require('../imagenes/Group129.png')} style={styles.iconImage} />
              <Text>Bomberos Voluntarios</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onAmbulanciasPress} style={styles.imageButton}>
              <Image source={require('../imagenes/Group130.png')} style={styles.iconImage} />
              <Text>Ambulancias</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onHospitalesPress} style={styles.imageButton}>
              <Image source={require('../imagenes/Group131.png')} style={styles.iconImage} />
              <Text>Hospitales</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Información Útil</Text>
            {/* Tarjeta de Kits de Emergencia */}
            <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScrollView}
            contentContainerStyle={styles.horizontalContentContainer}
          >
            {/* Tarjeta #1 */}
    
  <View style={styles.infoCard}>
  <TouchableOpacity onPress={() => navigation.navigate('kitset')}>
    {/* Contenido de la tarjeta */}
    <Image source={require('../imagenes/kits3.png')}  />
    {/* <Text style={styles.cardText}>Texto de la tarjeta si es necesario</Text> */}
    </TouchableOpacity>
  </View>


            {/* Tarjeta #2 */}
            <View style={styles.infoCard}>
            <TouchableOpacity onPress={() => navigation.navigate('eventoscreen')}>
              {/* Contenido de la tarjeta #2 */}
              <Image source={require('../imagenes/evtos3.png')}/>{/*style={styles.cardImage} */}
              </TouchableOpacity>

            </View>
             

            {/* Puedes agregar más tarjetas aquí si es necesario */}
          </ScrollView>
          </View>

          <Text style={styles.infoTitle}>Ultimas Emergencias</Text>
          {/* ScrollView horizontal para las tarjetas */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScrollView}
            contentContainerStyle={styles.horizontalContentContainer}
          >
            {/* Tarjeta #1 */}
    
  <View style={styles.infoCard}>
  <TouchableOpacity onPress={() => navigation.navigate('Amscreen')}>
    {/* Contenido de la tarjeta */}
    <Image source={require('../imagenes/emergencias/am2.png')}  />
    {/* <Text style={styles.cardText}>Texto de la tarjeta si es necesario</Text> */}
    </TouchableOpacity>
  </View>
            {/* Tarjeta #2 */}
            <View style={styles.infoCard}>
  <TouchableOpacity onPress={() => navigation.navigate('Ifscreen')}>
    {/* Contenido de la tarjeta */}
    <Image source={require('../imagenes/emergencias/if2.png')}  />
    {/* <Text style={styles.cardText}>Texto de la tarjeta si es necesario</Text> */}
    </TouchableOpacity>
  </View>
              {/* Tarjeta #3 */}
              <View style={styles.infoCard}>
  <TouchableOpacity onPress={() => navigation.navigate('Iescreen')}>
    {/* Contenido de la tarjeta */}
    <Image source={require('../imagenes/emergencias/ie2.png')}  />
    {/* <Text style={styles.cardText}>Texto de la tarjeta si es necesario</Text> */}
    </TouchableOpacity>
  </View>
               {/* Tarjeta #4 */}
               <View style={styles.infoCard}>
  <TouchableOpacity onPress={() => navigation.navigate('Dscreen')}>
    {/* Contenido de la tarjeta */}
    <Image source={require('../imagenes/emergencias/ds2.png')}  />
    {/* <Text style={styles.cardText}>Texto de la tarjeta si es necesario</Text> */}
    </TouchableOpacity>
  </View>
              {/* Tarjeta #5 */}
              <View style={styles.infoCard}>
  <TouchableOpacity onPress={() => navigation.navigate('Rascreen')}>
    {/* Contenido de la tarjeta */}
    <Image source={require('../imagenes/emergencias/ra2.png')}  />
    {/* <Text style={styles.cardText}>Texto de la tarjeta si es necesario</Text> */}
    </TouchableOpacity>
  </View>
              {/* Tarjeta #6 */}
              <View style={styles.infoCard}>
  <TouchableOpacity onPress={() => navigation.navigate('Rscreen')}>
    {/* Contenido de la tarjeta */}
    <Image source={require('../imagenes/emergencias/rs2.png')}  />
    {/* <Text style={styles.cardText}>Texto de la tarjeta si es necesario</Text> */}
    </TouchableOpacity>
  </View>

            {/* Puedes agregar más tarjetas aquí si es necesario */}
          </ScrollView>
        </>
      );
    
      return (
        <View style={styles.outerContainer}>

          
          <FlatList
            data={unidadesFiltradas}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onUnidadPress(item)}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListHeaderComponent={renderHeader()}
          />
          <FloatingButtonBar navigation={navigation} />
        </View>
      );
    };




const onAmbulanciasPress = () => {
    // Acciones cuando se presiona Ambulancias
};

  const onHospitalesPress = () => {
    // Acciones cuando se presiona Hospitales
  };



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Ajustado al color de fondo de la imagen
  },
  outerContainer: {
    flex: 1,
    backgroundColor: 'white', // o cualquier color de fondo que desees
  },
  supportSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    height: 60, // Ajustar según el tamaño de tu logo
    resizeMode: 'contain', // Para que la imagen del logo se ajuste sin deformarse
  },
  supportText: {
    fontSize: 14,
    color: '#5C6979',
    marginTop: 8,
    marginBottom: 60,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: 'black',
    paddingHorizontal: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  // Repetir estilos para iconButton para cada categoría
  infoSection: {
    paddingTop: 0, // Reducir el relleno superior para disminuir el espacio vertical
    paddingHorizontal: 20,
    paddingBottom: 20, // Ajustar según sea necesario para el espacio debajo de los botones
  },
  infoTitle: {
    fontSize: 18,
    paddingTop: 1,
    fontWeight: 'bold',
    color: '#424242',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEEE', // Ajustar según el diseño
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  groupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    marginBottom: 20,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    marginBottom: 1,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  
  clearButton: {
    padding: 10,
  },
  clearIcon: {
    width: 20,
    height: 20,
  },
  curveSection: {
    backgroundColor: '#fff',
    height: 40, // Altura de la curva
    overflow: 'hidden', // Esto es para asegurar que la imagen no desborde la parte curvada
  },
  curve: {
    flex: 1,
    width: '100%',
    borderBottomLeftRadius: 20, // Esto crea la curvatura, ajusta según tu diseño
    borderBottomRightRadius: 20, // Esto crea la curvatura, ajusta según tu diseño
  },
  dropdownSection: {
    paddingHorizontal: 20,
    marginTop: -10,
    alignItems: 'center', // Centra el dropdown horizontalmente
    zIndex: 1000, // Asegúrate de que el dropdown está sobre otros elementos
    marginBottom: 10,
  },
  dropdown: {
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    width: '50%', // Ajusta el ancho a la mitad del tamaño actual
    alignSelf: 'flex-start', // Alinea el dropdown en el centro de la sección
    zIndex: 1000, // Asegúrate de que el dropdown se muestre correctamente
  },
  dropDownContainer: {
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    zIndex: 1000, // Eleva el zIndex aquí también si es necesario
    width: '50%', // Ajusta el ancho si es necesario
    alignSelf: 'flex-start', // Esto alineará el dropdown a la izquierda
    
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 25,
    
  },
  imageButton: {
    alignItems: 'center',
    //justifyContent: 'center',
    width: '30%',
  },

  iconImage: {
    width: 80, // Ajusta según el tamaño de tus imágenes
    height: 80, // Ajusta según el tamaño de tus imágenes
    
  },
  kitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E8E8', // Cambia al color que prefieras para la tarjeta
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 35,
    marginTop: 5, // Ajusta este valor según sea necesario
    marginBottom: 5, // Ajusta este valor según sea necesario
  },
  kitIcon: {
    width: 50, // Ajusta según tu diseño
    height: 50, // Ajusta según tu diseño
    marginRight: 10, // Añade un margen a la derecha del icono
  },
  kitTextContainer: {
    flex: 1, // Esto asegura que el contenedor de texto ocupe el espacio restante
  },
  kitTitle: {
    fontWeight: 'bold',
    color: '#424242',
    bottom: 10, // Ajusta el margen inferior del título
    // Ajusta los demás estilos de texto como tamaño y color
  },
  kitSubtitle: {
    color: 'gray', // Ajusta el color del texto según tu diseño

},
infoCard: {
    // Ajusta estos estilos para que coincidan con los de tu diseño
    //backgroundColor: 'white', // o cualquier otro color de fondo que prefieras
    flexDirection: 'row', // Coloca los elementos en línea horizontal
    alignItems: 'center', // Alinea los elementos verticalmente
    borderRadius: 10, // para el efecto de esquinas redondeadas
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginBottom: 10, // Ajusta este valor según sea necesario
    marginHorizontal: 5, // para mantener un pequeño espacio entre las tarjetas
    shadowColor: '#000', // Estos estilos son para añadir sombra a cada tarjeta como en la imagen
    shadowOffset: {
      width: 0,
      height: 2,
    },
    //shadowOpacity: 0.25,
    //shadowRadius: 3.84,
    //elevation: 5,
  },

  cardTitle: {
    fontWeight: 'bold',
    color: '#424242',
    // Añade otros estilos de texto como tamaño y color que necesites
  },

  infoCardsContainer: {
    flexDirection: 'row', // Coloca los elementos en línea horizontal
    justifyContent: 'space-evenly', // Espacia los elementos uniformemente
    alignItems: 'center', // Alinea los elementos verticalmente
    marginBottom: 10, // Ajusta este valor según sea necesario
  },
    
  cardIcon: {
    width: 20, // Ajusta el ancho del icono de la tarjeta
    height: 20, // Ajusta la altura del icono de la tarjeta
    marginBottom: 2, // Espacio entre el icono y el texto
  },
  infoCardsContainers: {
    flexDirection: 'row',
    justifyContent: 'center', // Esto centrará las tarjetas en su contenedor
    alignItems: 'center',
    marginBottom: 20, // Esto agregará un margen inferior al contenedor de las tarjetas
  },
  
  
  cardSpacer: {
    width: 1, // Espacio entre las tarjetas, ajustar según sea necesario
  },
  
  horizontalScroll: {
    // Agrega aquí los estilos para tu ScrollView horizontal
    // Por ejemplo, puedes querer establecer un alto y quizás un margen:
    height: 120, // Altura de la ScrollView horizontal
    marginTop: 10, // Espacio superior de la ScrollView
  },
  horizontalScrollView: {
    // No es necesario establecer un alto aquí si todas tus tarjetas tienen un alto fijo
  },
  
  horizontalContentContainer: {
    alignItems: 'center',
  },

  cardText: {
    color: 'black', // color de texto
    fontSize: 12, // tamaño del texto
    textAlign: 'center', // si deseas que el texto esté centrado
    fontWeight: 'bold', // si el texto es en negrita
    // Agrega más estilos para el texto si es necesario
  },

  cardImage: {
    width: 20, // Ancho de la imagen
    height: 20, // Altura de la imagen
    marginRight: 10, // Espacio a la derecha de la imagen
  },
  
// ... otros estilos que necesites
});

export default MenuInicio;
