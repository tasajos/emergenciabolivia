import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import FloatingButtonBar from './FloatingButtonBar';
import DeviceInfo from 'react-native-device-info';
import styles from './estilos/EstilosIniciales'; // Importa los estilos
import fase1 from './estilos/fase1'; // Importa los estilos

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
  const [contadorInicial, setContadorInicial] = useState(10);
  const [contadorSeleccion, setContadorSeleccion] = useState(10);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [mostrarMensajeRapido, setMostrarMensajeRapido] = useState(false);
  const [seleccionados, setSeleccionados] = useState<Array<number>>([]);
  const [habilitarBoton, setHabilitarBoton] = useState(false);

  useEffect(() => {
    setAppVersion(DeviceInfo.getReadableVersion());

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (contadorInicial > 0) {
      timer = setTimeout(() => setContadorInicial(contadorInicial - 1), 1000);
    } else {
      setMostrarLista(true);
    }
    return () => clearTimeout(timer);
  }, [contadorInicial]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mostrarLista && contadorSeleccion > 0) {
      setMostrarMensajeRapido(true);
      timer = setTimeout(() => {
        setContadorSeleccion(contadorSeleccion - 1);
        if (contadorSeleccion === 1) {
          setMostrarMensajeRapido(false);
        }
      }, 1000);
    } else if (contadorSeleccion === 0) {
      setHabilitarBoton(true);
    }
    return () => clearTimeout(timer);
  }, [contadorSeleccion, mostrarLista]);

  const manejarSeleccion = (indice: number, correcto: boolean) => {
    if (contadorSeleccion === 0) return; // Impide la selección si el contador llegó a 0

    if (correcto) {
      setSeleccionados((prevSeleccionados) => [...prevSeleccionados, indice]);
    } else {
      setSeleccionados((prevSeleccionados) => [...prevSeleccionados, -indice]);
    }
  };

  const renderizarItem = (texto: string, indice: number, correcto: boolean) => (
    <TouchableOpacity
      key={indice}
      onPress={() => manejarSeleccion(indice, correcto)}
      disabled={contadorSeleccion === 0 || seleccionados.includes(indice) || seleccionados.includes(-indice)} // Deshabilita el botón si ya fue seleccionado o si el tiempo terminó
      style={[
        fase1.itemLista,
        seleccionados.includes(indice)
          ? fase1.itemCorrecto
          : seleccionados.includes(-indice)
          ? fase1.itemIncorrecto
          : {},
        contadorSeleccion === 0 && fase1.itemDeshabilitado, // Aplica un estilo deshabilitado cuando el tiempo termina
      ]}
    >
      <Text style={fase1.textoItem}>{texto}</Text>
    </TouchableOpacity>
  );

  const siguienteFase = () => {
    navigation.navigate('OtraPantalla'); // Reemplaza con la pantalla de la siguiente fase
  };

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

          {/* Contenido principal */}
          <View style={styles.contentContainer}>
            <Text style={fase1.textoLlamativo}>¡Te prepararemos para la fase 1!</Text>
            <Text style={fase1.subtitulo}>Plan de Evacuación Familiar</Text>
            <Text style={fase1.subtitulo}>1. Identificación de Zonas Seguras</Text>
            
            {!mostrarLista ? (
              <View>
                <Text style={fase1.contadorTexto}>El ejercicio comenzará en: {contadorInicial} segundos</Text>
              </View>
            ) : (
              <View>
                {mostrarMensajeRapido && (
                  <Text style={fase1.mensajeRapido}>¡Rápido! Tienes 10 segundos para identificar</Text>
                )}
                <Text style={fase1.instrucciones}>
                  Selecciona las zonas seguras dentro de la vivienda:
                </Text>
                <Text style={fase1.contadorTexto}>Tiempo restante: {contadorSeleccion} segundos</Text>
                {renderizarItem('Debajo de una mesa sólida', 1, true)}
                {renderizarItem('Cerca de una ventana', 2, false)}
                {renderizarItem('Debajo de una cama', 3, false)}
                {renderizarItem('En una esquina interna', 4, true)}
                {renderizarItem('En el ascensor', 5, false)}
                {renderizarItem('En la cocina', 6, false)}
                {renderizarItem('Debajo de una viga', 7, true)}
                {renderizarItem('En la escalera', 8, false)}
                {renderizarItem('En el baño', 9, false)}
                {renderizarItem('En el patio', 10, true)}
              </View>
            )}

            {habilitarBoton && (
              <View style={fase1.botonSiguienteContainer}>
                <Button title="Siguiente Fase" onPress={siguienteFase} />
              </View>
            )}
          </View>

          {/* Mostrar el versionName */}
          {/*<Text style={styles.versionText}>Versión: {appVersion}</Text>*/}
        </ScrollView>
      )}
      <FloatingButtonBar navigation={navigation} />
    </View>
  );
};

export default SismoEmer;
