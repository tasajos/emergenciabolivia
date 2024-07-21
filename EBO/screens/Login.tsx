import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import FloatingButtonBar from './FloatingButtonBar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
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

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert("Error", "Por favor, ingrese un correo electrónico y una contraseña.");
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
            Alert.alert("Éxito", "Login Exitoso");
            navigation.navigate('Uiadministrador' as never);
          } else {
            Alert.alert("Acceso denegado", "No tienes el rol de voluntario necesario para acceder a esta sección.");
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
  
      Alert.alert("Fallo de inicio de sesión", message);
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
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.version}>Login</Text>
        <Image style={styles.logo} source={require('../imagenes/logocha.png')} />
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          placeholderTextColor="#999" // Color del placeholder para dark theme
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          placeholderTextColor="#999" // Color del placeholder para dark theme
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePasswordRecovery}>
          <Text style={styles.forgotPassword}>Recuperar Contraseña</Text>
        </TouchableOpacity>
      </View>
      
      <FloatingButtonBar navigation={navigation} />
    </ScrollView>
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
  floatingButtonBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginBottom: 80,
  },
  version: {
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
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
    borderColor: '#ccc',
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
