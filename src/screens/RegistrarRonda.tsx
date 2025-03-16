import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
import RegistrarRondaStyles from '../styles/RegistrarRondaStyles';
import { sendEmail, salvarEmailOffline, enviarEmailsOffline } from '../services/emailService';

const RegistrarRonda = () => {
  const [isRondaIniciada, setIsRondaIniciada] = useState(false);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFinalizada, setHoraFinalizada] = useState('');
  const [bairro, setBairro] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [vigilante, setVigilante] = useState('');
  const [vigilantes, setVigilantes] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    carregarVigilantes();
    verificarRondaEmAndamento();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
      if (state.isConnected) {
        enviarEmailsOffline();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const carregarVigilantes = async () => {
    try {
      const vigilantesSalvos = await AsyncStorage.getItem('vigilantes');
      setVigilantes(vigilantesSalvos ? JSON.parse(vigilantesSalvos) : []);
    } catch (error) {
      console.error('Erro ao carregar vigilantes:', error);
    }
  };

  const verificarRondaEmAndamento = async () => {
    try {
      const rondasSalvas = await AsyncStorage.getItem('rondas');
      const rondas = rondasSalvas ? JSON.parse(rondasSalvas) : [];

      const rondaEmAberto = rondas.find((ronda: any) => ronda.horaFinalizada === '');

      if (rondaEmAberto) {
        setIsRondaIniciada(true);
        setHoraInicio(rondaEmAberto.horaInicio);
        setBairro(rondaEmAberto.bairro);
        setVigilante(rondaEmAberto.vigilante);
        setObservacoes(rondaEmAberto.observacoes);
      }
    } catch (error) {
      console.error('Erro ao verificar rondas:', error);
    }
  };

  const iniciarRonda = async () => {
    if (!bairro || !vigilante) {
      Alert.alert('Erro', 'Por favor, selecione um bairro e um vigilante antes de iniciar a ronda.');
      return;
    }

    try {
      const rondasSalvas = await AsyncStorage.getItem('rondas');
      const rondas = rondasSalvas ? JSON.parse(rondasSalvas) : [];

      const existeRondaAberta = rondas.some((ronda: any) => ronda.horaFinalizada === '');

      if (existeRondaAberta) {
        Alert.alert('Erro', 'Já existe uma ronda em andamento. Finalize antes de iniciar outra.');
        return;
      }

      const horaInicioAtual = moment().format('HH:mm:ss');
      setHoraInicio(horaInicioAtual);
      setIsRondaIniciada(true);

      const novaRonda = {
        vigilante,
        data: new Date().toLocaleDateString(),
        horaInicio: horaInicioAtual,
        bairro,
        observacoes: '',
        horaFinalizada: '',
      };

      rondas.push(novaRonda);
      await AsyncStorage.setItem('rondas', JSON.stringify(rondas));
    } catch (error) {
      console.error('Erro ao iniciar ronda:', error);
    }
  };

  const finalizarRonda = async () => {
    if (!horaInicio) {
      Alert.alert('Erro', 'A ronda ainda não foi iniciada.');
      return;
    }

    if (!observacoes) {
      Alert.alert('Erro', 'Por favor, preencha o campo de observações para finalizar a ronda.');
      return;
    }

    const horaFinalizadaAtual = moment().format('HH:mm:ss');

    try {
      const rondasSalvas = await AsyncStorage.getItem('rondas');
      let rondas = rondasSalvas ? JSON.parse(rondasSalvas) : [];

      rondas = rondas.map((ronda: any) =>
        ronda.horaFinalizada === ''
          ? { ...ronda, horaFinalizada: horaFinalizadaAtual, observacoes }
          : ronda
      );

      await AsyncStorage.setItem('rondas', JSON.stringify(rondas));

      setIsRondaIniciada(false);
      setHoraInicio('');
      setHoraFinalizada('');
      setBairro('');
      setObservacoes('');
      setVigilante('');

      if (isOnline) {
        sendEmail(rondas.find((r) => r.horaFinalizada === horaFinalizadaAtual));
      } else {
        salvarEmailOffline(rondas.find((r) => r.horaFinalizada === horaFinalizadaAtual));
      }

      Alert.alert('Sucesso', 'Ronda registrada com sucesso!', [{ text: 'OK' }]);
    } catch (error) {
      console.error('Erro ao finalizar ronda:', error);
    }
  };

  const voltar = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={RegistrarRondaStyles.container}>
      <Image source={{ uri: 'https://i.imgur.com/LG9X0st.png' }} style={RegistrarRondaStyles.logo} />
      <Text style={RegistrarRondaStyles.title}>Registrar Ronda</Text>

      <View style={RegistrarRondaStyles.fieldContainer}>
        <Text style={RegistrarRondaStyles.label}>Vigilante:</Text>
        <Picker
          selectedValue={vigilante}
          style={RegistrarRondaStyles.picker}
          onValueChange={(itemValue) => setVigilante(itemValue)}
          enabled={!isRondaIniciada}
        >
          <Picker.Item label="Selecione um Vigilante" value="" />
          {vigilantes.map((vigilanteItem, index) => (
            <Picker.Item key={index} label={vigilanteItem.nome} value={vigilanteItem.nome} />
          ))}
        </Picker>
      </View>

      <View style={RegistrarRondaStyles.fieldContainer}>
        <Text style={RegistrarRondaStyles.label}>Data:</Text>
        <Text style={RegistrarRondaStyles.value}>{new Date().toLocaleDateString()}</Text>
      </View>

      <View style={RegistrarRondaStyles.fieldContainer}>
        <Text style={RegistrarRondaStyles.label}>Horário de Início:</Text>
        <Text style={RegistrarRondaStyles.value}>{horaInicio || 'Não iniciado'}</Text>
      </View>

      <View style={RegistrarRondaStyles.fieldContainer}>
        <Text style={RegistrarRondaStyles.label}>Bairro:</Text>
        <Picker
          selectedValue={bairro}
          style={RegistrarRondaStyles.picker}
          onValueChange={(itemValue) => setBairro(itemValue)}
          enabled={!isRondaIniciada}
        >
          <Picker.Item label="Selecione o Bairro" value="" />
          <Picker.Item label="Ruinas" value="Ruinas" />
          <Picker.Item label="Vila Peruíbe" value="Vila Peruíbe" />
          <Picker.Item label="Centro" value="Centro" />
          <Picker.Item label="Parque Turístico" value="Parque Turístico" />
        </Picker>
      </View>

      {isRondaIniciada && (
        <View style={RegistrarRondaStyles.fieldContainer}>
          <Text style={RegistrarRondaStyles.label}>Observações:</Text>
          <TextInput
            style={RegistrarRondaStyles.input}
            multiline
            value={observacoes}
            onChangeText={setObservacoes}
            placeholder="Digite suas observações aqui..."
          />
        </View>
      )}

      <TouchableOpacity
        style={[RegistrarRondaStyles.button, { backgroundColor: isRondaIniciada ? 'red' : 'green' }]}
        onPress={isRondaIniciada ? finalizarRonda : iniciarRonda}
      >
        <Text style={RegistrarRondaStyles.buttonText}>{isRondaIniciada ? 'Finalizar Ronda' : 'Iniciar Ronda'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={RegistrarRondaStyles.backButton} onPress={voltar}>
        <Text style={RegistrarRondaStyles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
      <Text style={RegistrarRondaStyles.footer}>By Renan Oliveira</Text>
    </ScrollView>
  );
};

export default RegistrarRonda;
