import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen'; // Asegúrate de que la ruta sea correcta
import MenuInicio from './screens/MenuInicio'; // Asegúrate de que la ruta sea correcta
import RecInfo from './screens/RecInfo'; // Asegúrate de importar tu nueva pantalla RecInfo
import unidadesepr from './screens/unidadesepr';
import { Unidad } from './screens/types';
import kitset from './screens/kitset';
import Eventoscreen from './screens/Eventoscreen';
import Eventosv2 from './screens/Eventosv2';
import Amscreen from './screens/Amscreen';
import Ifscreen from './screens/Ifscreen';
import Iescreen from './screens/Iescreen';
import Rascreen from './screens/Rascreen';
import Rscreen from './screens/Rscreen';
import Dscreen from './screens/Dscreen';
import Ubicacionesbom from './screens/Ubicacionesbom';
import Contacto from './screens/Contacto';
import Kitterremoto from './screens/Kitterremoto';
import Kitinundacion from './screens/Kitinundacion';
import Login from './screens/Login';
import Uiadministrador from './screens/Uiadministrador';
import Uiadmineventos from './screens/Uiadmineventos';
import Uiadminepr from './screens/Uiadminepr';
import Uiadminnotif from './screens/Uiadminnotif';
import Uiadminalerta from './screens/Uiadminalerta';
import MapaHospitales from './screens/MapaHospitales';
import Ambulanciasepr from './screens/Ambulanciasepr';
import Ambulancias2doepr from './screens/Ambulancias2doepr';
import Educacionepr from './screens/Educacionepr';
import Educacion2doepr from './screens/Educacion2doepr';
import Ambientalistasepr from './screens/Ambientalistasepr';
import Animalistasepr from './screens/Animalistasepr';
import Ambientalistas2doepr from './screens/Ambientalistas2doepr';
import Animalistas2doepr from './screens/Animalistas2doepr';
import Homev2 from './screens/Homev2';
import firebase from '@react-native-firebase/app';


// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBOjSCE0nK8peMFZGQ5cLXRgKfBe_41dMk",
  authDomain: "chakuy.com",
  databaseURL: "https://fir-login2-c7a59-default-rtdb.firebaseio.com/",
  projectId: "fir-login2-c7a59",
  storageBucket: "fir-login2-c7a59.appspot.com",
  messagingSenderId: "306570664024",
  appId: "1:306570664024:android:3b7152b52a1dbc691a522d"
};

// Inicializa Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export type RootStackParamList = {
  Home: undefined;
  Homev2: undefined;
  MenuInicio: undefined;
  RecInfo: undefined;
  unidadesepr: {
    unidad: Unidad;
  } | undefined;
  kitset: undefined;
  Eventoscreen: undefined;
  Eventosv2: undefined;
  Amscreen: undefined;
  Ifscreen: undefined;
  Iescreen: undefined;
  Rascreen: undefined;
  Rscreen: undefined;
  Dscreen: undefined;
  Ubicacionesbom: undefined;
  Contacto: undefined;
  Kitterremoto: undefined;
  Kitinundacion: undefined;
  Login: undefined;
  Uiadministrador: undefined;
  Uiadmineventos: undefined;
  Uiadminepr: undefined;
  Uiadminnotif: undefined;
  Uiadminalerta: undefined;
  MapaHospitales: undefined;
  Ambientalistasepr: undefined;
  Animalistasepr: undefined;
  Ambulanciasepr: {
    unidad: Unidad;
  } | undefined;
  Ambulancias2doepr: {
    unidad: Unidad;
  } | undefined;
  Educacionepr: {
    unidad: Unidad;
  } | undefined;
  Educacion2doepr: {
    unidad: Unidad;
  } | undefined;
  Ambientalistas2doepr: {
    unidad: Unidad;
  } | undefined;
  Animalistas2doepr: {
    unidad: Unidad;
  } | undefined;


};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MenuInicio" component={MenuInicio} />
        <Stack.Screen name="RecInfo" component={RecInfo} />
        <Stack.Screen name="unidadesepr" component={unidadesepr} />
        <Stack.Screen name="kitset" component={kitset} />
        <Stack.Screen name="Eventoscreen" component={Eventoscreen} />
        <Stack.Screen name="Amscreen" component={Amscreen} />
        <Stack.Screen name="Ifscreen" component={Ifscreen} />
        <Stack.Screen name="Iescreen" component={Iescreen} />
        <Stack.Screen name="Rascreen" component={Rascreen} />
        <Stack.Screen name="Rscreen" component={Rscreen} />
        <Stack.Screen name="Dscreen" component={Dscreen} />
        <Stack.Screen name="Ubicacionesbom" component={Ubicacionesbom} />
        <Stack.Screen name="Contacto" component={Contacto} />
        <Stack.Screen name="Kitterremoto" component={Kitterremoto} />
        <Stack.Screen name="Kitinundacion" component={Kitinundacion} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Uiadministrador" component={Uiadministrador} />
        <Stack.Screen name="Uiadmineventos" component={Uiadmineventos} />
        <Stack.Screen name="Uiadminepr" component={Uiadminepr} />
        <Stack.Screen name="Uiadminnotif" component={Uiadminnotif} />
        <Stack.Screen name="Uiadminalerta" component={Uiadminalerta} />
        <Stack.Screen name="MapaHospitales" component={MapaHospitales} />
        <Stack.Screen name="Ambulanciasepr" component={Ambulanciasepr} />
        <Stack.Screen name="Ambulancias2doepr" component={Ambulancias2doepr} />
        <Stack.Screen name="Educacionepr" component={Educacionepr} />
        <Stack.Screen name="Educacion2doepr" component={Educacion2doepr} />
        <Stack.Screen name="Ambientalistasepr" component={Ambientalistasepr} />
        <Stack.Screen name="Ambientalistas2doepr" component={Ambientalistas2doepr} />
        <Stack.Screen name="Animalistasepr" component={Animalistasepr} />
        <Stack.Screen name="Animalistas2doepr" component={Animalistas2doepr} />
        <Stack.Screen name="Eventosv2" component={Eventosv2} />
        <Stack.Screen name="Homev2" component={Homev2} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;