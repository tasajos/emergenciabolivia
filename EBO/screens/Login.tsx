import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image,Alert } from 'react-native';
import FloatingButtonBar from './FloatingButtonBar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

// import { TextInput, Button } from 'react-native-paper';

const Login: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



  type RootStackParamList = {
    // ... otros parámetros de tus rutas
    Login: undefined; // Asegúrate de tener una ruta Eventos en tu StackNavigator
  };
  const handleLogin = async () => {
    // Asegúrate de que el correo electrónico y la contraseña no estén vacíos
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert("Error", "Por favor, ingrese un correo electrónico y una contraseña.");
      return; // Detiene la ejecución si alguno de los campos está vacío
    }
  
    try {
      let response = await auth().signInWithEmailAndPassword(email, password);
      if (response && response.user) {
        Alert.alert("Éxito", "Login Exitoso");
        navigation.navigate('Uiadministrador'); // Navega a la pantalla principal
      }
    
    } catch (error: any) { // Agrega el type assertion aquí
      let message;
      if (error.code === 'auth/user-not-found') {
        message = "No existe una cuenta para el correo electrónico ingresado.";
      } else if (error.code === 'auth/wrong-password') {
        message = "La contraseña ingresada es incorrecta.";
      } else {
        message = "Ha ocurrido un error inesperado. Por favor intente de nuevo.";
      }
  
      Alert.alert("Fallo de inicio de sesión", message);
    }
  };

  const handlePasswordRecovery = () => {
    // Maneja aquí la recuperación de la contraseña
    if (email.trim() === '') {
      Alert.alert('Ingrese email', 'Por favor ingrese su email para resetear su password.');
      return;
    }
    
    auth().sendPasswordResetEmail(email.trim())
      .then(() => {
        Alert.alert('Revisa tu email', 'Link de reinicio de contraseña fue enviada a tu correo');
      })
      .catch((error: any) => { // Agrega el type assertion aquí
        let message = "Ha ocurrido un error inesperado.";
        if (error.code === 'auth/user-not-found') {
          message = "No existe una cuenta con ese correo electrónico.";
        } else if (error.code === 'auth/invalid-email') {
          message = "El correo electrónico no es válido.";
        } else {
          message = error.message; // Puedes optar por mostrar el mensaje de error de Firebase
        }
      
        Alert.alert("Error", message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.version}>Login</Text>
      <Image style={styles.logo} source={require('../imagenes/tsflo1.png')} />
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry
      />
    
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePasswordRecovery}>
        <Text style={styles.forgotPassword}>Recuperar Contraseña</Text>
      </TouchableOpacity>
      <FloatingButtonBar navigation={navigation} />
    </View>
    
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  version: {
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    color: '#424242',
    
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginVertical: 10,
    color: 'blue',
  },
  button: {
    width: '60%',
    height: 40,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  buttonText: {
    color: '#ffffff',
  },
});

export default Login;
