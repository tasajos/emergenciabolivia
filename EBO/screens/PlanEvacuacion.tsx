import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import FloatingButtonBar from './FloatingButtonBar';




const PlanEvacuacion = () => {
  

  const [paso, setPaso] = useState(1);
  const totalPasos = 6;

  const [datosFormulario, setDatosFormulario] = useState({
    zonasSeguras: '',
    rutasEvacuacion: '',
    puntoEncuentro: '',
    comunicaciones: '',
    kitEmergencia: '',
    capacitacion: ''
  });

  const manejarSiguientePaso = () => {
    if (paso < totalPasos) {
      setPaso(paso + 1);
    }
  };

  const manejarPasoAnterior = () => {
    if (paso > 1) {
      setPaso(paso - 1);
    }
  };

  const manejarCambioInput = (campo: string, valor: string) => {
    setDatosFormulario({ ...datosFormulario, [campo]: valor });
  };

  const renderizarPaso = () => {
    switch (paso) {
      case 1:
        return (
          <View style={estilos.formGroup}>
            <Text style={estilos.label}>Identificación de zonas seguras dentro de la vivienda</Text>
            <TextInput
              style={estilos.input}
              placeholder="Describe las zonas seguras"
              value={datosFormulario.zonasSeguras}
              onChangeText={(valor) => manejarCambioInput('zonasSeguras', valor)}
            />
          </View>
        );
      case 2:
        return (
          <View style={estilos.formGroup}>
            <Text style={estilos.label}>Rutas de evacuación</Text>
            <TextInput
              style={estilos.input}
              placeholder="Describe las rutas de evacuación"
              value={datosFormulario.rutasEvacuacion}
              onChangeText={(valor) => manejarCambioInput('rutasEvacuacion', valor)}
            />
          </View>
        );
      case 3:
        return (
          <View style={estilos.formGroup}>
            <Text style={estilos.label}>Punto de encuentro</Text>
            <TextInput
              style={estilos.input}
              placeholder="Describe el punto de encuentro"
              value={datosFormulario.puntoEncuentro}
              onChangeText={(valor) => manejarCambioInput('puntoEncuentro', valor)}
            />
          </View>
        );
      case 4:
        return (
          <View style={estilos.formGroup}>
            <Text style={estilos.label}>Comunicaciones</Text>
            <TextInput
              style={estilos.input}
              placeholder="Planes de comunicación"
              value={datosFormulario.comunicaciones}
              onChangeText={(valor) => manejarCambioInput('comunicaciones', valor)}
            />
          </View>
        );
      case 5:
        return (
          <View style={estilos.formGroup}>
            <Text style={estilos.label}>Kit de emergencia</Text>
            <TextInput
              style={estilos.input}
              placeholder="Lista de artículos en el kit de emergencia"
              value={datosFormulario.kitEmergencia}
              onChangeText={(valor) => manejarCambioInput('kitEmergencia', valor)}
            />
          </View>
        );
      case 6:
        return (
          <View style={estilos.formGroup}>
            <Text style={estilos.label}>Capacitación y práctica</Text>
            <TextInput
              style={estilos.input}
              placeholder="Describe la capacitación y práctica"
              value={datosFormulario.capacitacion}
              onChangeText={(valor) => manejarCambioInput('capacitacion', valor)}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Plan de Evacuación Familiar</Text>
      <ProgressBar progress={paso / totalPasos} width={null} style={estilos.barraProgreso} />
      <View style={estilos.contenedorFormulario}>
        {renderizarPaso()}
      </View>
      <View style={estilos.botones}>
        <Button title="Anterior" onPress={manejarPasoAnterior} disabled={paso === 1} />
        <Button title={paso === totalPasos ? 'Finalizar' : 'Siguiente'} onPress={manejarSiguientePaso} />
      </View>
   
    </View>
    
  );

};

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  titulo: {
    fontSize: 24,
    color:'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  barraProgreso: {
    marginVertical: 20,
  },
  contenedorFormulario: {
    marginVertical: 20,
  },
  formGroup: {
    marginBottom: 15,
    color:'black',
  },
  label: {
    fontSize: 14,
    color:'black',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PlanEvacuacion;
