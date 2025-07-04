import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import FloatingButtonBar from './FloatingButtonBar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import { Modal } from 'react-native';
import database from '@react-native-firebase/database';

type RootStackParamList = {
  Login: undefined;
  Uiadministrador: undefined;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const Login: React.FC<Props> = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
const [modalMessage, setModalMessage] = useState('');
const [modalIcon, setModalIcon] = useState(null); // Para almacenar la imagen del ícono


const handleLogin = async () => {
  if (email.trim() === '' || password.trim() === '') {
    setModalMessage("Por favor, ingrese un correo electrónico y una contraseña.");
    setModalIcon(require('../imagenes/error-icon.png')); // Cambia a la ruta de tu ícono de error
    setModalVisible(true);
    return;
  }
  
  try {
    let response = await auth().signInWithEmailAndPassword(email, password);
    if (response && response.user) {
      const userId = response.user.uid;
      const userRef = database().ref(`/UsuariosVbo/${userId}`);
      userRef.on('value', (snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.rol === 'Voluntario') {
          setModalMessage("Login Exitoso");
          setModalIcon(require('../imagenes/autenticacion.png')); // Cambia a la ruta de tu ícono de éxito
          setModalVisible(true);
          setTimeout(() => {
            setModalVisible(false);
            navigation.navigate('Uiadministrador' as never);
          }, 2000); // Cerrar modal después de 2 segundos
        } else {
          setModalMessage("No tienes el rol de voluntario necesario para acceder a esta sección.");
          setModalIcon(require('../imagenes/error-icon.png'));
          setModalVisible(true);
          auth().signOut();
        }
      });
    }
  } catch (error: any) {
    let message;
    if (error.code === 'auth/user-not-found') {
      message = "No existe una cuenta para el correo electrónico ingresado.";
    } else if (error.code === 'auth/wrong-password') {
      message = "La contraseña ingresada es incorrecta.";
    } else {
      message = "Ha ocurrido un error inesperado. Por favor intente de nuevo.";
    }

    setModalMessage(message);
    setModalIcon(require('../imagenes/error-icon.png'));
    setModalVisible(true);
  }
};

  const handlePasswordRecovery = () => {
    if (email.trim() === '') {
      Alert.alert('Ingrese email', 'Por favor ingrese su email para resetear su password.');
      return;
    }
    
    auth().sendPasswordResetEmail(email.trim())
      .then(() => {
        Alert.alert('Revisa tu email', 'Link de reinicio de contraseña fue enviada a tu correo');
      })
      .catch((error: any) => {
        let message = "Ha ocurrido un error inesperado.";
        if (error.code === 'auth/user-not-found') {
          message = "No existe una cuenta con ese correo electrónico.";
        } else if (error.code === 'auth/invalid-email') {
          message = "El correo electrónico no es válido.";
        } else {
          message = error.message;
        }
      
        Alert.alert("Error", message);
      });
  };

  return (
    <View style={styles.mainContainer}>
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Image source={modalIcon} style={styles.modalIcon} />
          <Text style={styles.modalText}>{modalMessage}</Text>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.textStyle}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContentContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.version}>Login</Text>
        <Image style={styles.logo} source={require('../imagenes/logocha.png')} />
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePasswordRecovery}>
          <Text style={styles.forgotPassword}>Recuperar Contraseña</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    <View style={styles.floatingButtonBarContainer}>
      <FloatingButtonBar navigation={navigation} />
    </View>
  </View>
);
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  version: {
    alignSelf: 'flex-start',
    marginVertical: 10,
    fontSize: 18,
    color: '#424242',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  input: {
    width: 250,
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    color: '#424242',
    borderRadius: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginVertical: 10,
    color: 'blue',
  },
  button: {
    width: 80,
    height: 40,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
  },
  floatingButtonBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
  },
  buttonClose: {
    backgroundColor: 'blue',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },


});

export default Login;
