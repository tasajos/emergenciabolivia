import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen'; // Asegúrate de que la ruta sea correcta
import MenuInicio from './screens/MenuInicio'; // Asegúrate de que la ruta sea correcta
import RecInfo from './screens/RecInfo'; // Asegúrate de importar tu nueva pantalla RecInfo
import unidadesepr from './screens/unidadesepr';
import { Unidad } from './screens/types';


export type RootStackParamList = {
  Home: undefined;
  MenuInicio: undefined;
  RecInfo: undefined;
  unidadesepr: {
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;