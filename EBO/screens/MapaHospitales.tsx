import React from 'react';
import { StyleSheet, View,ActivityIndicator  } from 'react-native';
import { WebView } from 'react-native-webview';
import FloatingButtonBar from './FloatingButtonBar';
import { StackNavigationProp } from '@react-navigation/stack';


type RootStackParamList = {
    MapaHospitales: undefined;
  };

  type MapaHospitalesProps = {

    navigation: StackNavigationProp<RootStackParamList>;
  };

  const MapaHospitales: React.FC<MapaHospitalesProps> = ({ navigation }) => {
    const [isLoading, setIsLoading] = React.useState(true);

    return (
        <View style={styles.container}>

                {isLoading && (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}


            <WebView
                source={{ uri: 'https://www.google.com/maps/d/u/0/embed?mid=1CgSfd2x10OUglFePi43uLUpX_0hYKNE&ehbc=2E312F' }}             
                style={styles.webView}
                onLoad={() => setIsLoading(false)}
            />
            <FloatingButtonBar navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webView: {
        flex: 7, // 
    },
    floatingBar: {
        flex: 3, 
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
});

export default MapaHospitales;
