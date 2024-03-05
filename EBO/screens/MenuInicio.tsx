import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image,ImageBackground } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';



const DetailsScreen = () => {

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
    const clearSearch = () => {
      setSearchQuery('');
    };

  return (
    <ScrollView style={styles.container}>

<View style={styles.curveSection}>
        {/* Puedes reemplazar esta View por una ImageBackground si tienes una imagen específica para usar */}
        <Image source={require('../imagenes/top.png')} style={styles.curve} />
      </View>
      <View style={styles.supportSection}>
        <Image source={require('../imagenes/tsflo1.png')} style={styles.logo} />
        <Text style={styles.supportText}>Con el Apoyo de Tunari sin Fuego</Text>
      </View>
      <View style={styles.searchSection}>
        <Image
          source={require('../imagenes/lupa.png')} // Asegúrate de tener un icono de búsqueda
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar una unidad"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#000"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Image
              source={require('../imagenes/cerrars.png')} // Asegúrate de tener un icono de cierre
              style={styles.clearIcon}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.categoryContainer}>
        {/* Icon Buttons */}
        <TouchableOpacity style={styles.iconButton}>
          {/* ... */}
        </TouchableOpacity>
        {/* Repetir para cada categoría */}
      </View>
      <View style={styles.dropdownSection}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Selecciona una ciudad"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropDownContainer}
        dropDownDirection="AUTO" // Ajusta la dirección del desplegable automáticamente
        zIndex={3000} // Asegúrate de que el dropdown se muestre correctamente
        listMode="SCROLLVIEW" // Cambia el modo de la lista para permitir el desplazamiento
            />
            </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Información Útil</Text>
        <TouchableOpacity style={styles.infoButton}>
          {/* ... */}
        </TouchableOpacity>
        <Text style={styles.infoTitle}>Grupos de Información</Text>
        <TouchableOpacity style={styles.groupButton}>
          {/* ... */}
        </TouchableOpacity>
        {/* Repetir para cada grupo */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Ajustado al color de fondo de la imagen
  },
  supportSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    height: 80, // Ajustar según el tamaño de tu logo
    resizeMode: 'contain', // Para que la imagen del logo se ajuste sin deformarse
  },
  supportText: {
    fontSize: 14,
    color: '#5C6979',
    marginTop: 8,
    marginBottom: 20,
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
    padding: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
    paddingBottom: 10,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEEE', // Ajustar según el diseño
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  groupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
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
    borderBottomLeftRadius: 50, // Esto crea la curvatura, ajusta según tu diseño
    borderBottomRightRadius: 50, // Esto crea la curvatura, ajusta según tu diseño
  },
  dropdownSection: {
    paddingHorizontal: 20,
    marginTop: -10,
    alignItems: 'center', // Centra el dropdown horizontalmente
    zIndex: 1000, // Asegúrate de que el dropdown está sobre otros elementos
    marginBottom: 30,
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
  // ... otros estilos que necesites
});

export default DetailsScreen;
