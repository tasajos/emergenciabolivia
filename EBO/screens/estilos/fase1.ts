import { StyleSheet } from 'react-native';

const faseuno = StyleSheet.create({
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
      textAlign: 'center',
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
    textoItem: {
      fontSize: 16,
      color: '#333',
    },
    itemDeshabilitado: {
        opacity: 0.5,
      },
      
  });

export default faseuno;
