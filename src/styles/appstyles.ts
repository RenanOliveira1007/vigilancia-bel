import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16,
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  contentContainer: {
    alignItems: 'center', 
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 60,
  },
  button: {
    backgroundColor: '#000',
    width: 300,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  footer: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 14,
    color: 'gray',
  }
});

export default styles;
