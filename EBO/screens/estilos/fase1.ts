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
      modalText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 15,
        color: '#333',
      },


  });
  
  export default fase1;