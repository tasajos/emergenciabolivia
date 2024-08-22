import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  listContainer: {
    flex: 0.9, // 90% del espacio
  },
  sectionListContainer: {
    paddingHorizontal: 10,
    paddingBottom: 90,
  },
  floatingButtonContainer: {
    flex: 0.1, // 10% del espacio
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerContainer: {
    //flexDirection: 'row',
    //justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#f8f8f8',
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  supportText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    //marginHorizontal: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cardImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  cardInfo: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  botonEmergencia: {
    flex: 1,
    backgroundColor: '#FFA726',
    borderRadius: 15,
    margin: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  botonImagen: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  botonTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#43A047',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 10,
  },
});
