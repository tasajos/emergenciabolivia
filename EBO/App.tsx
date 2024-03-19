import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen'; // Asegúrate de que la ruta sea correcta
import MenuInicio from './screens/MenuInicio'; // Asegúrate de que la ruta sea correcta
import RecInfo from './screens/RecInfo'; // Asegúrate de importar tu nueva pantalla RecInfo
import unidadesepr from './screens/unidadesepr';
import { Unidad } from './screens/types';
import kitset from './screens/kitset';
import eventoscreen from './screens/eventoscreen';
import Amscreen from './screens/Amscreen';
import Ifscreen from './screens/Ifscreen';
import Iescreen from './screens/Iescreen';
import Rascreen from './screens/Rascreen';
import Rscreen from './screens/Rscreen';
import Dscreen from './screens/Dscreen';
import ubicacionesbom from './screens/ubicacionesbom';
import Contacto from './screens/Contacto';
import Kitterremoto from './screens/kitterremoto';
import Kitinundacion from './screens/kitinundacion';

export type RootStackParamList = {
  Home: undefined;
  MenuInicio: undefined;
  RecInfo: undefined;
  unidadesepr: {
    unidad: Unidad;
  } | undefined;
  kitset: undefined;
  eventoscreen: undefined;
  Amscreen: undefined;
  Ifscreen: undefined;
  Iescreen: undefined;
  Rascreen: undefined;
  Rscreen: undefined;
  Dscreen: undefined;
  ubicacionesbom: undefined;
  Contacto: undefined;
  Kitterremoto: undefined;
  Kitinundacion: undefined;
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
        <Stack.Screen name="eventoscreen" component={eventoscreen} />
        <Stack.Screen name="Amscreen" component={Amscreen} />
        <Stack.Screen name="Ifscreen" component={Ifscreen} />
        <Stack.Screen name="Iescreen" component={Iescreen} />
        <Stack.Screen name="Rascreen" component={Rascreen} />
        <Stack.Screen name="Rscreen" component={Rscreen} />
        <Stack.Screen name="Dscreen" component={Dscreen} />
        <Stack.Screen name="ubicacionesbom" component={ubicacionesbom} />
        <Stack.Screen name="Contacto" component={Contacto} />
        <Stack.Screen name="Kitterremoto" component={Kitterremoto} />
        <Stack.Screen name="Kitinundacion" component={Kitinundacion} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;