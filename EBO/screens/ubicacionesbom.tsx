import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import FloatingButtonBar from './FloatingButtonBar';

const Ubicacionesbom = ({ navigation }) => { // Asegúrate de pasar navigation como prop
    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: 'https://www.google.com/maps/d/u/0/embed?mid=1xF1uos94-XtO9Ht1eWlbzaxdPZAQT_4&ehbc=2E312F' }}
                style={styles.webView}
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
        flex: 8, // Ocupa el 90% de la pantalla
    },
    floatingBar: {
        flex: 2, // Ocupa el 10% restante de la pantalla
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      },
});

export default Ubicacionesbom;
