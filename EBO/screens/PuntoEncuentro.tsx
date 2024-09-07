import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import FloatingButtonBar from './FloatingButtonBar';
import DeviceInfo from 'react-native-device-info';
import styles from './estilos/EstilosIniciales';
import fase1 from './estilos/fase1';

type RootStackParamList = {
  Comunicaciones: { seleccionadosFase1: number[], seleccionadosFase2: number[], seleccionadosFase3: number[] };
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
  route: { params: { seleccionadosFase1: number[], seleccionadosFase2: number[] } };
};

const PuntoEncuentro: React.FC<Props> = ({ navigation, route }) => {
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
      setMostrarMensajeRapido(true);
    }
    return () => clearTimeout(timer);
  }, [contadorInicial]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mostrarLista && contadorSeleccion > 0) {
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
    if (contadorSeleccion === 0) return;

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
      disabled={contadorSeleccion === 0 || seleccionados.includes(indice) || seleccionados.includes(-indice)}
      style={[
        fase1.itemLista,
        seleccionados.includes(indice)
          ? fase1.itemCorrecto
          : seleccionados.includes(-indice)
          ? fase1.itemIncorrecto
          : {},
        contadorSeleccion === 0 && fase1.itemDeshabilitado,
      ]}
    >
      <Text style={fase1.textoItem}>{texto}</Text>
    </TouchableOpacity>
  );

  const siguienteFase = () => {
    navigation.navigate('Comunicaciones', {
      seleccionadosFase1: route.params.seleccionadosFase1,
      seleccionadosFase2: route.params.seleccionadosFase2,
      seleccionadosFase3: seleccionados
    });
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

          <View style={styles.contentContainer}>
            <Text style={fase1.textoLlamativo}>¡Te prepararemos para la fase 3!</Text>
            <Text style={fase1.subtitulo}>Plan de Evacuación Familiar</Text>
            <Text style={fase1.subtitulo}>3. Punto de Encuentro</Text>

            <Text style={fase1.instrucciones}>Resultados de la Fase 1:</Text>
            {route.params.seleccionadosFase1.map((indice) => (
              <View key={indice} style={fase1.itemCorrecto}>
                <Text style={fase1.textoItem}>
                  {indice === 1 && 'Debajo de una mesa sólida'}
                  {indice === 4 && 'En una esquina interna'}
                  {indice === 7 && 'Debajo de una viga'}
                  {indice === 10 && 'En el patio'}
                </Text>
              </View>
            ))}

            <Text style={fase1.instrucciones}>Resultados de la Fase 2:</Text>
            {route.params.seleccionadosFase2.map((indice) => (
              <View key={indice} style={fase1.itemCorrecto}>
                <Text style={fase1.textoItem}>
                  {indice === 1 && 'Salir por la puerta principal'}
                  {indice === 4 && 'Usar las escaleras de emergencia'}
                  {indice === 8 && 'Salir por la puerta trasera'}
                </Text>
              </View>
            ))}

            {!mostrarLista ? (
              <View>
                <Text style={fase1.contadorTexto}>El ejercicio comenzará en: {contadorInicial} segundos</Text>
              </View>
            ) : (
              <View>
                {mostrarMensajeRapido && (
                  <Text style={fase1.mensajeRapido}>¡Rápido! Tienes 10 segundos para seleccionar</Text>
                )}
                <Text style={fase1.instrucciones}>
                  Selecciona los puntos de encuentro óptimos:
                </Text>
                <Text style={fase1.contadorTexto}>Tiempo restante: {contadorSeleccion} segundos</Text>
                {renderizarItem('Frente a la casa', 1, true)}
                {renderizarItem('En el parque del barrio', 2, true)}
                {renderizarItem('Dentro del coche en el garaje', 3, false)}
                {renderizarItem('En la esquina de la calle', 4, true)}
                {renderizarItem('En el sótano de la casa', 5, false)}
                {renderizarItem('En la azotea del edificio', 6, false)}
              </View>
            )}

            {habilitarBoton && (
              <View style={fase1.botonSiguienteContainer}>
                <Button title="Siguiente Fase" onPress={siguienteFase} />
              </View>
            )}
          </View>
        </ScrollView>
      )}
      <FloatingButtonBar navigation={navigation} />
    </View>
  );
};

export default PuntoEncuentro;