import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import FloatingButtonBar from './FloatingButtonBar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// import { TextInput, Button } from 'react-native-paper';

const Login: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



  type RootStackParamList = {
    // ... otros parámetros de tus rutas
    Login: undefined; // Asegúrate de tener una ruta Eventos en tu StackNavigator
  };
  const handleLogin = () => {
    // Aquí manejarías el inicio de sesión, por ejemplo, utilizando Firebase Auth
    // Firebase authentication code here
  };

  const handlePasswordRecovery = () => {
    // Aquí manejarías la recuperación de contraseña
    // Password recovery code here
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
