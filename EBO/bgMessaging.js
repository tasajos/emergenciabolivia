// bgMessaging.js

import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  try {
    console.log('Mensaje FCM en segundo plano:', remoteMessage);
    // Tu código para manejar el mensaje aquí
  } catch (error) {
    console.error('Error al manejar mensaje en segundo plano:', error);
  }
});

export default () => {};