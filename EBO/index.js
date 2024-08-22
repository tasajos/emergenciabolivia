import React, { useState, useEffect } from 'react';
import { AppRegistry } from 'react-native';
import { initializeApp } from '@react-native-firebase/app';
import App from './App';
import { name as appName } from './app.json';
import { initializeFCM } from './FCMService';
import NotificationPermissionModal from './screens/NotificationPermissionModal'; // Importa el modal

const firebaseConfig = {
  apiKey: "AIzaSyBOjSCE0nK8peMFZGQ5cLXRgKfBe_41dMk",
  authDomain: "chakuy.com",
  databaseURL: "https://fir-login2-c7a59-default-rtdb.firebaseio.com/",
  projectId: "fir-login2-c7a59",
  storageBucket: "fir-login2-c7a59.appspot.com",
  messagingSenderId: "306570664024",
  appId: "1:306570664024:android:3b7152b52a1dbc691a522d"
};

initializeApp(firebaseConfig);

const Main = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Inicializa FCM
    initializeFCM();

    // Mostrar el modal para solicitar permisos
    setModalVisible(true);
  }, []);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <>
      <App />
      <NotificationPermissionModal
        isVisible={isModalVisible}
        onClose={handleModalClose}
      />
    </>
  );
};

AppRegistry.registerComponent(appName, () => Main);