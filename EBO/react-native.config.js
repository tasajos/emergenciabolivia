module.exports = {
  project: {
    android: {
      sourceDir: './android',
    },
  },
  dependencies: {
    '@react-native-firebase/app': {
      platforms: {
        android: null,
      },
    },
    '@react-native-firebase/auth': {
      platforms: {
        android: null,
      },
    },
    '@react-native-firebase/storage': {
      platforms: {
        android: null,
      },
    },
    '@react-native-firebase/messaging': {
      platforms: {
        android: null,
      },
    },

     'react-native-gesture-handler': {
      platforms: {
        android: {
          packageImportPath: 'import com.swmansion.gesturehandler.RNGestureHandlerPackage;',
        },
         },
          },
  },
};