// Kitinundacion.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import FloatingButtonBar from './FloatingButtonBar';

type KitItem = {
  name: string;
  isEssential: boolean;
  selected?: boolean;
};

type RootStackParamList = {
  Kitset: undefined;
};

const shuffleArray = (array: KitItem[]): KitItem[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const Kitinundacion = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const initialItems: KitItem[] = [
    { name: 'Bolsas impermeables', isEssential: true },
    { name: 'Copia de seguridad de documentos importantes', isEssential: true },
    { name: 'Agua embotellada', isEssential: true },
    { name: 'Comida no perecedera', isEssential: true },
    { name: 'Pilas', isEssential: true },
    { name: 'Radio a pilas', isEssential: true },
    { name: 'Ropa de cambio', isEssential: true },
    { name: 'Kit de higiene personal', isEssential: true },
    { name: 'Dinero', isEssential: false },
    { name: 'Computadora', isEssential: false },
  ];

  const [items, setItems] = useState<KitItem[]>(shuffleArray([...initialItems]));
  const [gameOver, setGameOver] = useState(false);
  const [points, setPoints] = useState(0);
  const [messageShown, setMessageShown] = useState(false);

  useEffect(() => {
    setItems(shuffleArray([...initialItems]));
  }, []);

  const handleSelectItem = (index: number) => {
    if (gameOver) {
      Alert.alert('Juego terminado', 'Ya seleccionaste un elemento no esencial.');
      return;
    }

    const newItems = [...items];
    const currentItem = newItems[index];

    currentItem.selected = !currentItem.selected;
    if (currentItem.isEssential && currentItem.selected) {
      const newPoints = points + 2;
      setPoints(newPoints);
      if (newPoints >= 6 && !messageShown) {
        setMessageShown(true);
        Alert.alert('¡Bien hecho!', 'Has alcanzado los puntos necesarios para ganar, pero el juego continúa hasta que selecciones un elemento no esencial.');
      }
    } else if (!currentItem.isEssential && currentItem.selected) {
      setGameOver(true);
      Alert.alert('Juego terminado', 'Seleccionaste un elemento no esencial. Puntos finales: ' + points, [{ text: 'Reiniciar Juego', onPress: handleRestartGame }]);
    }

    setItems(newItems);
  };

  const handleRestartGame = () => {
    setItems(shuffleArray([...initialItems]));
    setGameOver(false);
    setPoints(0);
    setMessageShown(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../imagenes/top.png')} style={styles.headerImage} />
        <Text style={styles.headerText}>Con el Apoyo de</Text>
        <Image source={require('../imagenes/logov4.png')} style={styles.logo} />
      </View>
      <Text style={styles.description}>
        Selecciona los elementos que crees que son esenciales para un kit de inundación.
      </Text>
      <Text style={styles.points}>Puntos: {points}</Text>
      <View style={{ flex: 1, paddingBottom: 60 }}>
        <Image source={require('../imagenes/mochila_inundacion.png')} style={styles.backpackIcon} />
        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.kitItem,
                item.selected === true ? (item.isEssential ? styles.itemCorrect : styles.itemIncorrect) : null,
              ]}
              onPress={() => handleSelectItem(index)}
              disabled={item.selected && !item.isEssential}
            >
              <Text style={styles.kitText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <FloatingButtonBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerImage: {
    width: '80%',
    height: 60,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 16,
    color: '#424242',
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    color: '#424242',
  },
  backpackIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    margin: 20,
  },
  kitItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  itemCorrect: {
    backgroundColor: 'lightgreen',
  },
  itemIncorrect: {
    backgroundColor: 'salmon',
  },
  kitText: {
    fontSize: 16,
    color: '#424242',
  },
  logo: {
    height: 50,
    resizeMode: 'contain',
    marginTop: 20,
  },
  points: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default Kitinundacion;