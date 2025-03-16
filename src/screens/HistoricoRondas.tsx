import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/HistoricoRondasStyles'; // Importando os estilos

const HistoricoRondas = () => {
  const [rondas, setRondas] = useState<any[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    carregarRondas();
  }, []);

  const carregarRondas = async () => {
    try {
      const rondasSalvas = await AsyncStorage.getItem('rondas');
      if (rondasSalvas) {
        setRondas(JSON.parse(rondasSalvas).reverse());
      }
    } catch (error) {
      console.error('Erro ao carregar as rondas:', error);
    }
  };

  const removerRonda = async (index: number) => {
    try {
      const novasRondas = [...rondas];
      novasRondas.splice(index, 1);
      setRondas(novasRondas);
      await AsyncStorage.setItem('rondas', JSON.stringify(novasRondas.reverse()));
    } catch (error) {
      console.error('Erro ao remover a ronda:', error);
    }
  };

  const renderItem = ({ item, index }: any) => {
    if (!item.data) {
      return <Text style={styles.aviso}>Erro: Data não encontrada</Text>;
    }

    const hoje = new Date();
    let dataFinalizacao;

    try {
      if (item.data.includes('/')) {
        const partes = item.data.split('/');
        if (partes[0].length === 4) {
          dataFinalizacao = new Date(`${partes[0]}-${partes[1]}-${partes[2]}`);
        } else {
          dataFinalizacao = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
        }
      } else if (item.data.includes('-')) {
        dataFinalizacao = new Date(item.data);
      } else {
        throw new Error('Formato de data desconhecido');
      }
    } catch (error) {
      console.error('Erro ao interpretar a data:', item.data);
      return <Text style={styles.aviso}>Erro na data: {item.data}</Text>;
    }

    if (isNaN(dataFinalizacao.getTime())) {
      return <Text style={styles.aviso}>Erro na data: {item.data}</Text>;
    }

    const diferencaDias = Math.floor((hoje.getTime() - dataFinalizacao.getTime()) / (1000 * 60 * 60 * 24));
    const diasRestantes = Math.max(15 - diferencaDias, 0);
    const permitidoExcluir = diferencaDias >= 15;

    return (
      <View style={styles.rondaContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Vigilante: {item.vigilante}</Text>
          <TouchableOpacity onPress={() => permitidoExcluir && removerRonda(index)} disabled={!permitidoExcluir}>
            <AntDesign name="delete" size={24} color={permitidoExcluir ? "red" : "gray"} />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Data: {item.data}</Text>
        <Text style={styles.label}>Horário de Início: {item.horaInicio}</Text>
        <Text style={styles.label}>Horário de Finalização: {item.horaFinalizada}</Text>
        <Text style={styles.label}>Bairro: {item.bairro}</Text>
        <Text style={styles.label}>Observações: {item.observacoes}</Text>
        {!permitidoExcluir && (
          <Text style={styles.aviso}>
            🔒 Só pode ser excluído após {diasRestantes} {diasRestantes === 1 ? "dia" : "dias"}.
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
        <Text style={styles.textoVoltar}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Histórico de Rondas</Text>
      <FlatList
        data={rondas}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default HistoricoRondas;
