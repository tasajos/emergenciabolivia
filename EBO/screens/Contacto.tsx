import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert,SafeAreaView,Text, Image} from 'react-native';
import database from '@react-native-firebase/database';
import { useNavigation } from '@react-navigation/native';
import FloatingButtonBar from './FloatingButtonBar';

const Contacto = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    comentario: '',
  });

  type RootStackParamList = {
    // ... otros parámetros de tus rutas
    Contacto: undefined; // Asegúrate de tener una ruta Eventos en tu StackNavigator
  };
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };


  const isValidEmail = (email) => {
    // A simple email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = () => {
    // Aquí podrías añadir validaciones a tu formulario

    if (!isValidEmail(form.email)) {
        Alert.alert('Error', 'Por favor ingresa un correo electrónico válido.');
        return;
      }
      
    // Envía los datos a Firebase
    database()
      .ref('/contactos')
      .push(form)
      .then(() => Alert.alert('Mensaje enviado', 'Tu mensaje ha sido enviado correctamente.'))
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Hubo un problema al enviar tu mensaje.');
      });
  };

  return (

<SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
          <Image source={require('../imagenes/tsflo1.png')} style={styles.logo} />
          <Text style={styles.headerText}>Con el Apoyo de Tunari sin Fuego</Text>
        </View>

        <View style={styles.formContainer}>
      <Text style={styles.instructions}>
        Escribe tus comentarios o eventos de un suceso:
      </Text>
      </View>
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={form.nombre}
        onChangeText={(text) => handleChange('nombre', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={form.email}
        onChangeText={(text) => handleChange('email', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefono"
        keyboardType="phone-pad"
        value={form.telefono}
        onChangeText={(text) => handleChange('telefono', text)}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Evento o Comentario"
        value={form.comentario}
        onChangeText={(text) => handleChange('comentario', text)}
        multiline
      />
      <Button title="Enviar" onPress={handleSubmit} />
      <FloatingButtonBar navigation={navigation} />
    </View>
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: 'flex-start',
    backgroundColor: '#fff'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  header: {
    alignItems: 'center',
    marginBottom: 5,
  },
  headerImage: {
    width: '80%',
    height: 60, // Altura de tu curva
    resizeMode: 'contain',
  },
  logo: {
    height: 80, // Ajusta la altura de tu logo
    resizeMode: 'contain', // Contiene la imagen dentro del espacio disponible sin deformarla
    marginTop: 20, // Ajusta el margen superior si es necesario
  },
  headerText: {
    fontSize: 16,
    //fontWeight: 'bold',
    color: '#424242',
    marginTop: 10, // Ajustar según tu diseño
    marginBottom: 50, // Ajustar según tu diseño
  },
  formContainer: {
    padding: 20, // Add padding if needed
  },
  instructions: {
    fontSize: 16,
    textAlign: 'justify',
    marginBottom: 20, // Add some space before the inputs
  },
});

export default Contacto;
