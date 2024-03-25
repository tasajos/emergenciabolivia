// bgMessaging.js

import messaging from '@react-native-firebase/messaging';

// Este manejador se ejecutará cuando la aplicación esté en segundo plano o cerrada
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Mensaje FCM en segundo plano:', remoteMessage);
  // Aquí puedes manejar el mensaje en segundo plano
});

// Debes exportar una función vacía para evitar errores
export default () => {};
