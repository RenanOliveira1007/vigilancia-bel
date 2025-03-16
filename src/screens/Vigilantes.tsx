import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/vigilantesStyles';  // Importando o arquivo de estilos

// Definição da interface para melhor tipagem
interface Vigilante {
  nome: string;
  turno: string;
}

const Vigilantes = () => {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [turno, setTurno] = useState('');
  const [vigilantes, setVigilantes] = useState<Vigilante[]>([]);

  useEffect(() => {
    carregarVigilantes();
  }, []);

  const carregarVigilantes = async () => {
    try {
      const vigilantesSalvos = await AsyncStorage.getItem('vigilantes');
      if (vigilantesSalvos) {
        setVigilantes(JSON.parse(vigilantesSalvos));
      }
    } catch (error) {
      console.error('Erro ao carregar vigilantes:', error);
    }
  };

  const salvarVigilante = async () => {
    if (!nome.trim() || !turno) {
      Alert.alert('Erro', 'Preencha todos os campos antes de salvar.');
      return;
    }

    const nomeFormatado = nome.trim().toUpperCase();
    const nomeExiste = vigilantes.some((vigilante) => vigilante.nome === nomeFormatado);

    if (nomeExiste) {
      Alert.alert('Erro', 'Este vigilante já está cadastrado.');
      return;
    }

    try {
      const novoVigilante = { nome: nomeFormatado, turno };
      const novaLista = [...vigilantes, novoVigilante];
      setVigilantes(novaLista);
      await AsyncStorage.setItem('vigilantes', JSON.stringify(novaLista));
      setNome('');
      setTurno('');
      Alert.alert('Sucesso', 'Vigilante cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar vigilante:', error);
    }
  };

  const excluirVigilante = (index: number) => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja excluir este vigilante?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const novaLista = vigilantes.filter((_, i) => i !== index);
              setVigilantes(novaLista);
              await AsyncStorage.setItem('vigilantes', JSON.stringify(novaLista));
            } catch (error) {
              console.error('Erro ao excluir vigilante:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Vigilantes</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Vigilante"
        value={nome}
        onChangeText={setNome}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={turno}
          style={styles.picker}
          onValueChange={(itemValue) => setTurno(itemValue)}
        >
          <Picker.Item label="Selecione o Turno" value="" />
          <Picker.Item label="Diurno" value="Diurno" />
          <Picker.Item label="Noturno" value="Noturno" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={salvarVigilante} activeOpacity={0.7}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      <FlatList
        data={vigilantes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>{item.nome} - {item.turno}</Text>
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={() => excluirVigilante(index)}
            >
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Vigilantes;
