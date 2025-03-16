import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  botaoVoltar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 8,
    width: 100,
    marginBottom: 10,
  },
  textoVoltar: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  rondaContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  aviso: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
  },
});

export default styles;
