import React, { useState } from 'react';
import { 
    StyleSheet, 
    ScrollView, 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Image, 
    Alert,
    Modal,
    ActivityIndicator
} from 'react-native';
import FloatingButtonBar from './FloatingButtonBar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
// MEJORA: Importamos un ícono para el campo de la contraseña.
// Asegúrate de tener instalada la librería: npm install react-native-vector-icons
// O si usas Expo, ya viene incluida.
import Ionicons from 'react-native-vector-icons/Ionicons';

// Tipos de navegación, sin cambios.
type RootStackParamList = {
  Login: undefined;
  Uiadministrador: undefined;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const Login: React.FC<Props> = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // --- MEJORA: Nuevos estados para una mejor UX ---
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalIcon, setModalIcon] = useState<number | null>(null); // Tipo explícito para la imagen
  const [isLoading, setIsLoading] = useState(false); // Para el spinner del botón
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Para mostrar/ocultar contraseña

  // MEJORA: Función centralizada para mostrar el modal de feedback.
  const showModal = (message: string, isError: boolean) => {
    setModalMessage(message);
    setModalIcon(isError ? require('../imagenes/error-icon.png') : require('../imagenes/autenticacion.png'));
    setModalVisible(true);
  };

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      showModal("Por favor, ingrese un correo y una contraseña.", true);
      return;
    }
    
    setIsLoading(true); // MEJORA: Inicia la carga
    
    try {
      const response = await auth().signInWithEmailAndPassword(email.trim(), password);
      if (response.user) {
        const userId = response.user.uid;
        // ¡FIX CRÍTICO! Usamos .once() para leer los datos una sola vez y evitar fugas de memoria.
        const userSnapshot = await database().ref(`/UsuariosVbo/${userId}`).once('value');
        const userData = userSnapshot.val();
        
        if (userData && userData.rol === 'Voluntario') {
          showModal("Login Exitoso", false);
          setTimeout(() => {
            setModalVisible(false);
            navigation.navigate('Uiadministrador'); // No más 'as never'
          }, 2000);
        } else {
          showModal("No tienes el rol de voluntario necesario.", true);
          await auth().signOut();
        }
      }
    } catch (error: any) {
      let message;
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
        message = "El correo electrónico ingresado no existe.";
      } else if (error.code === 'auth/wrong-password') {
        message = "La contraseña es incorrecta.";
      } else {
        message = "Ocurrió un error inesperado. Inténtelo de nuevo.";
      }
      showModal(message, true);
    } finally {
        setIsLoading(false); // MEJORA: Termina la carga, tanto en éxito como en error.
    }
  };

  // Función original de recuperación, se podría mejorar para que use el Modal en lugar de Alert.
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
            {modalIcon && <Image source={modalIcon} style={styles.modalIcon} />}
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
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity 
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
            >
              <Ionicons name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={24} color="grey" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>INICIAR SESION</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handlePasswordRecovery}>
            <Text style={styles.forgotPassword}>Recuperar Contraseña</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* MEJORA: Se recomienda quitar la barra de navegación de la pantalla de Login para una mejor UX */}
      {/* <View style={styles.floatingButtonBarContainer}>
        <FloatingButtonBar navigation={navigation} />
      </View> 
      */}
    </View>
  );
};

// Se combinan los estilos originales con los nuevos
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
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
    width: '100%',
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
  inputContainer: { // NUEVO estilo para el contenedor del input
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: 50,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: { // Modificado para ser flexible dentro del contenedor
    flex: 1,
    height: '100%',
    color: '#424242',
  },
  eyeIcon: { // NUEVO estilo para el ícono del ojo
    padding: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginVertical: 10,
    color: 'blue',
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  floatingButtonBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
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
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    padding: 10,
    elevation: 2,
    borderRadius: 8,
    width: 100,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Login;