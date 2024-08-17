import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, TouchableOpacity, ActivityIndicator, Image, Modal } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import FloatingButtonBar from './FloatingButtonBar';
import DeviceInfo from 'react-native-device-info';
import styles from './estilos/EstilosIniciales';
import fase1 from './estilos/fase1';

type RootStackParamList = {
  FinalPantalla: undefined;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
  route: { params: { seleccionadosFase1: number[], seleccionadosFase2: number[], seleccionadosFase3: number[], seleccionadosFase4: number[] } };
};

const KitEmergencia: React.FC<Props> = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [appVersion, setAppVersion] = useState('');
  const [contadorInicial, setContadorInicial] = useState(10);
  const [contadorSeleccion, setContadorSeleccion] = useState(20);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [mostrarMensajeRapido, setMostrarMensajeRapido] = useState(false);
  const [seleccionados, setSeleccionados] = useState<Array<number>>([]);
  const [habilitarBoton, setHabilitarBoton] = useState(false);
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [mostrarModalFallo, setMostrarModalFallo] = useState(false);

  const seleccionadosFase1 = route.params.seleccionadosFase1;
  const seleccionadosFase2 = route.params.seleccionadosFase2;
  const seleccionadosFase3 = route.params.seleccionadosFase3;
  const seleccionadosFase4 = route.params.seleccionadosFase4;

  const validos = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 14, 15]; // IDs de elementos válidos

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
      const correctosSeleccionados = seleccionados.filter((id) => validos.includes(id));
      if (correctosSeleccionados.length >= 12) { // Verificación de que el usuario haya seleccionado al menos 12 elementos válidos
        setMostrarModalExito(true);
      } else {
        setMostrarModalFallo(true);
      }
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

  const intentarDeNuevo = () => {
    setMostrarModalFallo(false);
    setSeleccionados([]); // Restablecer selección
    setContadorSeleccion(20); // Restablecer contador
    setHabilitarBoton(false); // Deshabilitar el botón de finalizar
    setMostrarMensajeRapido(true); // Mostrar nuevamente el mensaje rápido
  };

  const finalizar = () => {
    setMostrarModalExito(false);
    navigation.navigate('FinalPantalla', {
      seleccionadosFase1,
      seleccionadosFase2,
      seleccionadosFase3,
      seleccionadosFase4,
      seleccionadosFase5: seleccionados,
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
            <Text style={fase1.textoLlamativo}>¡Te prepararemos para la fase 5!</Text>
            <Text style={fase1.subtitulo}>Plan de Evacuación Familiar</Text>
            <Text style={fase1.subtitulo}>5. Kit de Emergencia</Text>

            {/* Mostrar los resultados de las fases anteriores */}
            <Text style={fase1.instrucciones}>Resultados de las Fases Anteriores:</Text>
            <Text style={fase1.subtitulo}>Fase 1:</Text>
            {seleccionadosFase1.map((indice, i) => (
              <View key={i} style={fase1.itemCorrecto}>
                <Text style={fase1.textoItem}>
                  {indice === 1 && 'Debajo de una mesa sólida'}
                  {indice === 4 && 'En una esquina interna'}
                  {indice === 7 && 'Debajo de una viga'}
                  {indice === 10 && 'En el patio'}
                </Text>
              </View>
            ))}
            <Text style={fase1.subtitulo}>Fase 2:</Text>
            {seleccionadosFase2.map((indice, i) => (
              <View key={i} style={fase1.itemCorrecto}>
                <Text style={fase1.textoItem}>
                  {indice === 1 && 'Salir por la puerta principal'}
                  {indice === 4 && 'Usar las escaleras de emergencia'}
                  {indice === 8 && 'Salir por la puerta trasera'}
                </Text>
              </View>
            ))}
            <Text style={fase1.subtitulo}>Fase 3:</Text>
            {seleccionadosFase3.map((indice, i) => (
              <View key={i} style={fase1.itemCorrecto}>
                <Text style={fase1.textoItem}>
                  {indice === 1 && 'Frente a la casa'}
                  {indice === 2 && 'En el parque del barrio'}
                  {indice === 4 && 'En la esquina de la calle'}
                </Text>
              </View>
            ))}
            <Text style={fase1.subtitulo}>Fase 4:</Text>
            {seleccionadosFase4.map((indice, i) => (
              <View key={i} style={fase1.itemCorrecto}>
                <Text style={fase1.textoItem}>
                  {indice === 1 && 'Informar a todos los miembros de la familia sobre el plan de emergencia'}
                  {indice === 3 && 'Contactar a las autoridades locales antes del sismo'}
                  {indice === 5 && 'Enviar mensajes de texto para confirmar la seguridad después del sismo'}
                </Text>
              </View>
            ))}

            {/* Nueva lista para el kit de emergencia */}
            {!mostrarLista ? (
              <View>
                <Text style={fase1.contadorTexto}>El ejercicio comenzará en: {contadorInicial} segundos</Text>
              </View>
            ) : (
              <View>
                {mostrarMensajeRapido && (
                  <Text style={fase1.mensajeRapido}>¡Rápido! Tienes 20 segundos para seleccionar</Text>
                )}
                <Text style={fase1.instrucciones}>
                  Selecciona los elementos que deberían estar en un kit de emergencia:
                </Text>
                <Text style={fase1.contadorTexto}>Tiempo restante: {contadorSeleccion} segundos</Text>
                {renderizarItem('Agua embotellada', 1, true)}
                {renderizarItem('Comida no perecedera', 2, true)}
                {renderizarItem('Ropa de abrigo', 3, true)}
                {renderizarItem('Juguetes para niños', 4, true)}
                {renderizarItem('Dinero en efectivo', 5, true)}
                {renderizarItem('Cargador de celular', 6, false)}
                {renderizarItem('Medicamentos', 7, true)}
                {renderizarItem('Suministros de higiene', 8, true)}
                {renderizarItem('Pasaporte', 9, true)}
                {renderizarItem('Linterna', 10, true)}
                {renderizarItem('Documentos importantes', 11, true)}
                {renderizarItem('Zapatos cómodos', 12, true)}
                {renderizarItem('Silla plegable', 13, false)}
                {renderizarItem('Mantita', 14, true)}
                {renderizarItem('Papel higiénico', 15, true)}
                {renderizarItem('Cafetera', 16, false)}
                {renderizarItem('Televisión portátil', 17, false)}
                {renderizarItem('Sombrero', 18, false)}
              </View>
            )}

            {/* Modal de éxito */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={mostrarModalExito}
              onRequestClose={() => setMostrarModalExito(false)}
            >
              <View style={fase1.modalContainer}>
                <View style={fase1.modalView}>
                  <Text style={fase1.modalText}>¡Felicidades! Seleccionaste el número mínimo de elementos válidos.</Text>
                  <Button title="Finalizar" onPress={finalizar} />
                </View>
              </View>
            </Modal>

            {/* Modal de fallo */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={mostrarModalFallo}
              onRequestClose={() => setMostrarModalFallo(false)}
            >
              <View style={fase1.modalContainer}>
                <View style={fase1.modalView}>
                  <Text style={fase1.modalText}>¡No alcanzaste el límite necesario de elementos válidos!</Text>
                  <Button title="Inténtalo de nuevo" onPress={intentarDeNuevo} />
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      )}
      <FloatingButtonBar navigation={navigation} />
    </View>
  );
};

export default KitEmergencia;