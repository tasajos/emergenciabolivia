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
