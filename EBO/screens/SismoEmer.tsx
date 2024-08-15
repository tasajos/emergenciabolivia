import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import FloatingButtonBar from './FloatingButtonBar';
import DeviceInfo from 'react-native-device-info';
import styles from './EstilosIniciales'; // Importa los estilos

type RootStackParamList = {
  NuevoScreen: undefined;
  OtraPantalla: undefined;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const SismoEmer: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    setAppVersion(DeviceInfo.getReadableVersion());

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Text style={styles.supportText}>Con el Apoyo de</Text>
            <Image source={require('../imagenes/logov5.png')} style={styles.logo} />
          </View>

          {/* Contenido adicional */}
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Contenido del Nuevo Screen</Text>
            <Text style={styles.description}>
              Aquí puedes agregar cualquier otro contenido o funcionalidad que desees.
            </Text>
          </View>

          {/* Mostrar el versionName */}
          <Text style={styles.versionText}>Versión: {appVersion}</Text>
        </ScrollView>
      )}
      <FloatingButtonBar navigation={navigation} />
    </View>
  );
};

export default SismoEmer;
