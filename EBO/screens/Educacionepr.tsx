import React, { useState ,useCallback,useEffect  } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity,ActivityIndicator  } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import FloatingButtonBar from './FloatingButtonBar';
import database from '@react-native-firebase/database';
import firebase from '@react-native-firebase/app';

type RootStackParamList = {
    Home: undefined;
    Details: undefined;
    RecInfo: undefined;
    Educacionepr: {
    unidad: Unidad;
} | undefined;
Educacion2doepr: {
    unidad: Unidad;
} | undefined;

  };

type RecInfoScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Educacionepr'
>;

type Props = {
  navigation: RecInfoScreenNavigationProp;
};

interface Unidad {
  name: string;
  image: { uri: string };
  ciudad?: string;
}



const Educacionepr: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const ref = database().ref('/educacion');
    setLoading(true);
    ref.once('value')
      .then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          const unidadesFiltradas = Object.keys(data).filter((key) => {
            // Aquí comprobamos que el nombre O la ciudad contienen el texto de búsqueda
            const nombre = data[key].nombre.toLowerCase();
            const ciudad = (data[key].ciudad || '').toLowerCase();
            const busqueda = searchQuery.toLowerCase();
            return nombre.includes(busqueda) || ciudad.includes(busqueda);
          }).map((key) => ({
            name: data[key].nombre,
            image: { uri: data[key].imagen },
            ciudad: data[key].ciudad,
            telefono: data[key].telefono,
            facebook: data[key].facebook,
            web: data[key].web,


          }));
  
          setUnidades(unidadesFiltradas);
          setLoading(false);
        } else {
          console.log('No hay datos disponibles en esta ruta.');
        }
      })
      .catch((error) => {
        console.error('Error al recuperar los datos:', error);
      });
  }, [searchQuery]); // La dependencia [searchQuery] asegura que el efecto se ejecute de nuevo cuando cambie la búsqueda.

    const clearSearch = () => {
        setSearchQuery('');
      };
    const items = [
        { name: 'Yunka Atoq', image: require('../imagenes/logos/yunka_atoq_log.png') },
        { name: 'Thasnuq', image: require('../imagenes/logos/thasnuq.jpg') },
        { name: 'Resistencia', image: require('../imagenes/logos/resistencia.jpeg') },
        { name: 'Cruz de Malta', image: require('../imagenes/logos/cruzdemalta.jpeg') },
        { name: 'Bear', image: require('../imagenes/emblemabo.png') },
        { name: 'Sar Bolivia', image: require('../imagenes/logos/logosar.png') },
        { name: 'Aeronauticos', image: require('../imagenes/logos/aeronauticosbv.jpg') },
        { name: 'Fuego y Rescate', image: require('../imagenes/logos/fuego_rescate.png') },
        // ... add all your items here
      ];



      //const handlePress = (itemName: string) => {
        //navigation.navigate('unidadesepr', { name: itemName });
     // };

     const handlePress = (unidad: Unidad) => {
      navigation.navigate('Educacion2doepr', { unidad: unidad });
    };

    return (
        <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.headerContainer}>
            {/* Example of logo and text in header */}
            <Text style={styles.supportText}>Con el Apoyo de</Text>
            <Image source={require('../imagenes/instit2.png')} style={styles.logo} />
            
          </View>
          <View style={styles.searchContainer}>
          <Image
          source={require('../imagenes/lupa.png')} // Asegúrate de tener un icono de búsqueda
          style={styles.searchIcon}
        />

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por Nombre o Ciudad"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#000"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Image
                source={require('../imagenes/cerrars.png')} // Asegúrate de tener esta imagen o ícono en tus recursos
                style={styles.clearIcon}
              />
            </TouchableOpacity>
          )}
        </View>
          <View style={styles.dropdownContainer}>
            {/* Implement dropdown here */}
          </View>
          <View style={styles.gridContainer}>
          {unidades.map((unidad, index) => (


            <TouchableOpacity
            key={index}
            style={styles.itemContainer}
            onPress={() => handlePress(unidad)} // Utiliza unidad.name para acceder al nombre de la unidad
          >
            {/* Comprueba que unidad.image y unidad.image.uri existen antes de intentar renderizar la imagen */}
            {unidad.image && unidad.image.uri ? (
              <Image source={{ uri: unidad.image.uri }} style={styles.itemImage} />
            ) : (
              <Image source={require('../imagenes/emblema.png')} style={styles.itemImage} />
              // Coloca una imagen de reserva aquí si la unidad no tiene una imagen
            )}
            <Text style={styles.itemText}>{unidad.name}</Text>
          </TouchableOpacity>
          ))}
          </View>
        </ScrollView>
        <FloatingButtonBar navigation={navigation} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      // ... other styles for your main container
    },
    scrollView: {
      // If you have specific styles for the ScrollView
    },
    headerContainer: {
      alignItems: 'center',
      padding: 20,
      // ... styles for your header
    },
    logo: {
      resizeMode: 'contain',
      height: 60,
      // ... other logo styles
    },
    supportText: {
      marginTop: 10,
      // ... other text styles
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center', // centra los ítems verticalmente
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#fff', // o cualquier color de fondo que desees
        borderWidth: 1, // opcional: si deseas un borde alrededor de todo el contenedor de búsqueda
        borderColor: '#ccc', // opcional: el color de ese borde
        borderRadius: 5, // opcional: bordes redondeados para el contenedor completo
      },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: 'black',
        paddingHorizontal: 10,
        borderWidth: 1, // añade borde de 1px
        borderColor: '#000', // el color del borde será negro
        borderRadius: 25, // los bordes redondeados con radio de 5px
        marginLeft: 10, // añade un pequeño margen a la izquierda si es necesario para separar del ícono
      },
    clearButton: {
        padding: 10,
      },
    dropdownContainer: {
      // ... styles for dropdown container
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Esto distribuirá los elementos de manera uniforme
        alignItems: 'flex-start', // Alinea los elementos al inicio de su contenedor
        paddingHorizontal: 20, // Agrega un padding horizontal para evitar que los elementos toquen los bordes
    },
    itemContainer: {
      width: '30%', // Adjust the width as needed
      aspectRatio: 1, // Esto asegurará que cada item sea cuadrado (ajusta según necesites)
    marginBottom: 20, // Esto añade un margen abajo de cada elemento
    padding: 10, // Esto es opcional, dependiendo de si quieres espacio dentro del contenedor
      // ... other item container styles
    },
    itemImage: {
        width: '100%', // Esto hará que la imagen ocupe todo el ancho de su contenedor
        height: '100%', // Esto hará que la imagen ocupe todo el alto de su contenedor
        resizeMode: 'contain' // Esto asegurará que la imagen se escale correctamente dentro de su contenedor
    },
    itemText: {
        textAlign: 'center',
        marginTop: 2,
        fontSize: 12, // Reducir el tamaño de la fuente si es necesario
        flexWrap: 'wrap', // Permitir que el texto se ajuste al siguiente renglón
      },
    footerContainer: {
      // ... styles for your footer
    },
    floatingButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: 'red',
      padding: 15,
      borderRadius: 30,
      // ... other floating button styles
    },
    clearIcon: {
        width: 20,
        height: 20,
      },
      searchIcon: {
        width: 20,
        height: 20,
        margin: 10, // asegúrate de que el ícono no esté pegado al borde
      },
      spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },


    // ... cualquier otro estilo que necesites
});

export default Educacionepr;
