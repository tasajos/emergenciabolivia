import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import FloatingButtonBar from './FloatingButtonBar';
import DeviceInfo from 'react-native-device-info';
import styles from './estilos/EstilosIniciales';
import fase1 from './estilos/fase1';

type RootStackParamList = {
  PuntoEncuentro: { seleccionadosFase1: number[], seleccionadosFase2: number[] };
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
  route: { params: { seleccionadosFase1: number[] } };
};

const RutasEvacuacion: React.FC<Props> = ({ navigation, route }) => {
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
    navigation.navigate('PuntoEncuentro', { seleccionadosFase1: route.params.seleccionadosFase1, seleccionadosFase2: seleccionados });
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
            <Text style={fase1.textoLlamativo}>¡Te prepararemos para la fase 2!</Text>
            <Text style={fase1.subtitulo}>Plan de Evacuación Familiar</Text>
            <Text style={fase1.subtitulo}>2. Rutas de Evacuación</Text>

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
                  Selecciona las rutas de evacuación óptimas:
                </Text>
                <Text style={fase1.contadorTexto}>Tiempo restante: {contadorSeleccion} segundos</Text>
                {renderizarItem('Salir por la puerta principal', 1, true)}
                {renderizarItem('Tomar el ascensor', 2, false)}
                {renderizarItem('Salir por la ventana', 3, false)}
                {renderizarItem('Usar las escaleras de emergencia', 4, true)}
                {renderizarItem('Correr por el pasillo central', 5, false)}
                {renderizarItem('Subir al techo', 6, false)}
                {renderizarItem('Abrir una ventana para salir', 7, false)}
                {renderizarItem('Salir por la puerta trasera', 8, true)}
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

export default RutasEvacuacion;
