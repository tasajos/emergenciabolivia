import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    marginBottom: '16%',
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  supportText: {
    fontSize: 14,
    color: '#5C6979',
    marginBottom: 10,
  },
  logo: {
    height: 60,
    resizeMode: 'contain',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#5C6979',
  },
  versionText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#424242',
    marginTop: 20,
    marginLeft: 20,
  },
});

export default styles;
