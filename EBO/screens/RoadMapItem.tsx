// RoadMapItem.tsx
import React from 'react';
import { View, Text, StyleSheet, Image ,ImageSourcePropType } from 'react-native';


// Define una interfaz para las propiedades de tu componente
interface RoadMapItemProps {
    step: string;
    description: string;
    imageSource: ImageSourcePropType;
  }


// Usa la interfaz como el tipo de tus props
const RoadMapItem: React.FC<RoadMapItemProps> = ({ step, description, imageSource }) => {
    return (
      <View style={roadMapStyles.container}>
        <Image source={imageSource} style={roadMapStyles.image} />
        <View style={roadMapStyles.content}>
          <Text style={roadMapStyles.step}>{step}</Text>
          <Text style={roadMapStyles.description}>{description}</Text>
        </View>
      </View>
    );
  };

const roadMapStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  step: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  description: {
    fontSize: 14,
    color: '#424242',
  },
});

export default RoadMapItem;
