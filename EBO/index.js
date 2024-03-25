/**
 * @format
 */

import {AppRegistry} from 'react-native';
//import firebase from '@react-native-firebase/app';
//import { firebase } from '@react-native-firebase/app';
import { initializeApp } from '@react-native-firebase/app';
import App from './App';
import {name as appName} from './app.json';
import bgMessaging from './bgMessaging'; // Importa el manejador de mensajes en segundo plano

// Initialize Firebase
const firebaseConfig = {
  // Tu configuración de Firebase va aquí
  apiKey: "AIzaSyBOjSCE0nK8peMFZGQ5cLXRgKfBe_41dMk",
  authDomain: "chakuy.com",
  databaseURL: "https://fir-login2-c7a59-default-rtdb.firebaseio.com/",
  projectId: "fir-login2-c7a59",
  storageBucket: "fir-login2-c7a59.appspot.com",
  messagingSenderId: "306570664024",
  appId: "1:306570664024:android:3b7152b52a1dbc691a522d"
};

//if (!firebase.apps.length) {
  //firebase.initializeApp(firebaseConfig);

 // initializeApp(firebaseConfig);
//}

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging); // Registra el manejador de mensajes en segundo plano
