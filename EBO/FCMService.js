/*

import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const initializeFCM = () => {
  messaging().requestPermission().then(authStatus => {
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  messaging().onMessage(async remoteMessage => {
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });
};
*/


/*
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const initializeFCM = () => {
  messaging().requestPermission().then(authStatus => {
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  messaging().onMessage(async remoteMessage => {
    if (remoteMessage.notification) {
      const { title, body } = remoteMessage.notification;
      Alert.alert(title, body);
    } else {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    }
  });
};
*/

/*
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const initializeFCM = () => {
  messaging().requestPermission().then(authStatus => {
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);

      // Obtener y mostrar el token de FCM
      messaging()
        .getToken()
        .then(token => {
          console.log('FCM Token:', token);
        })
        .catch(error => {
          console.error('FCM Token Error:', error);
        });
    }
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  messaging().onMessage(async remoteMessage => {
    if (remoteMessage.notification) {
      const { title, body } = remoteMessage.notification;
      Alert.alert(title, body);
    } else {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    }
  });
};
*/


/*
import { Alert, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const requestNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const permission = await messaging().requestPermission();
    if (permission === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('Notification permission granted.');
    } else if (permission === messaging.AuthorizationStatus.PROVISIONAL) {
      console.log('Notification permission provisionally granted.');
    } else {
      console.log('Notification permission denied.');
      Alert.alert(
        'Permiso necesario',
        'Esta aplicación necesita permiso para enviar notificaciones. Por favor, habilítalo en la configuración.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir configuración', onPress: () => messaging().openSettings() },
        ],
        { cancelable: false }
      );
    }
  } else {
    console.log('No es necesario solicitar permiso en este dispositivo.');
  }
};

// Asegúrate de llamar a esta función en el momento adecuado, como en el inicio de la app:
export const initializeFCM = () => {
  requestNotificationPermission();

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  messaging().onMessage(async remoteMessage => {
    if (remoteMessage.notification) {
      const { title, body } = remoteMessage.notification;
      Alert.alert(title, body);
    } else {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    }
  });

  messaging()
    .getToken()
    .then(token => {
      console.log('FCM Token:', token);
    })
    .catch(error => {
      console.error('FCM Token Error:', error);
    });
};

*/

import { Alert, Platform, Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const openAppNotificationSettings = () => {
  if (Platform.OS === 'android') {
    const packageName = 'chakuy.com.vbo';  // Cambia esto por tu nombre de paquete
    Linking.openSettings();
  } else {
    Linking.openURL('app-settings:');
  }
};

export const requestUserPermissionForNotifications = async () => {
  Alert.alert(
    'Permitir Notificaciones',
    '¿Deseas habilitar las notificaciones para esta aplicación?',
    [
      {
        text: 'No',
        onPress: () => console.log('Permiso de notificación denegado'),
        style: 'cancel',
      },
      {
        text: 'Sí',
        onPress: async () => {
          const permission = await messaging().requestPermission();
          if (
            permission === messaging.AuthorizationStatus.AUTHORIZED ||
            permission === messaging.AuthorizationStatus.PROVISIONAL
          ) {
            console.log('Permiso de notificación concedido.');
            // Redirigir a la configuración de la aplicación
            openAppNotificationSettings();
          } else {
            console.log('Permiso de notificación denegado.');
            Alert.alert(
              'Permiso Necesario',
              'Esta aplicación necesita permiso para enviar notificaciones. Por favor, habilítalo en la configuración.',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Abrir Configuración', onPress: openAppNotificationSettings },
              ],
              { cancelable: false }
            );
          }
        },
      },
    ],
    { cancelable: false }
  );
};

export const initializeFCM = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  messaging().onMessage(async remoteMessage => {
    if (remoteMessage.notification) {
      const { title, body } = remoteMessage.notification;
      Alert.alert(title, body);
    } else {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    }
  });

  messaging()
    .getToken()
    .then(token => {
      console.log('FCM Token:', token);
    })
    .catch(error => {
      console.error('FCM Token Error:', error);
    });
};
