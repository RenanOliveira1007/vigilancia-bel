// App.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import styles from './src/styles/appstyles'; // Importando estilos externos

type Props = {
  navigation: any; // Defina um tipo para o navigation
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      console.log("Carregando dados...");
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Erro ao carregar dados', error);
      } finally {
        setLoading(false);
        console.log("Carregamento concluído");
      }
    };

    loadData();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Image
            source={{ uri: 'https://i.imgur.com/LG9X0st.png' }}
            style={styles.logo}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('RegistrarRonda')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Registrar Ronda</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Vigilantes')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Vigilantes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('HistoricoRondas')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Histórico de Rondas</Text>
          </TouchableOpacity>
          <Text style={styles.footer}>By Renan Oliveira</Text>

        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;
