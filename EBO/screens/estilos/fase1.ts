import { StyleSheet } from 'react-native';

const fase1 = StyleSheet.create({
    textoLlamativo: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FF4500',
      textAlign: 'center',
      marginVertical: 20,
    },
    subtitulo: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#424242',
      textAlign: 'center',
      marginBottom: 20,
    },
    contadorTexto: {
      fontSize: 18,
      textAlign: 'center',
      marginVertical: 20,
      color: '#333',
    },
    instrucciones: {
      fontSize: 18,
      marginBottom: 10,
      color: '#424242',
      textAlign: 'center',
    },
    mensajeRapido: {
      fontSize: 20,
      color: '#FF0000',
      textAlign: 'center',
      marginVertical: 10,
    },
    itemLista: {
      padding: 15,
      marginVertical: 5,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
    },
    itemCorrecto: {
      backgroundColor: '#d4edda',
    },
    itemIncorrecto: {
      backgroundColor: '#f8d7da',
    },
    itemDeshabilitado: {
      opacity: 0.5,
    },
    textoItem: {
      fontSize: 16,
      color: '#333',
    },
    botonSiguienteContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
  });
  
  export default fase1;