import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import FloatingButtonBar from './FloatingButtonBar';
import DeviceInfo from 'react-native-device-info';
import database from '@react-native-firebase/database';

type RootStackParamList = {
  Homev2: undefined;
  MenuInicio: undefined;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const Homev2: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [appVersion, setAppVersion] = useState('');
  const [versionName, setVersionName] = useState('');

  useEffect(() => {

    setAppVersion(DeviceInfo.getReadableVersion());
    const getVersionName = async () => {
      const version = await DeviceInfo.getVersion();
      setVersionName(version);
    };
    getVersionName();  
    // Simula la carga de datos con un retraso de 2 segundos
    setTimeout(() => {
      setLoading(false); // Actualiza el estado para detener la carga
    }, 2000);
  }, []);



  
  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {!loading && (
        <ScrollView style={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Text style={styles.supportText}>Con el Apoyo de</Text>
            <Image source={require('../imagenes/instit2.png')} style={styles.logo} />
          </View>
        </ScrollView>
      )}
      <FloatingButtonBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  supportText: {
    fontSize: 14,
    color: '#5C6979',
    marginBottom: 10,
  },
  logo: {
    height: 60,
    resizeMode: 'contain',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Add other styles as needed
});

export default Homev2;
