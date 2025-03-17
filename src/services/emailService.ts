import emailjs from 'emailjs-com';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Função para verificar a conexão de rede
const verificarConexao = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  console.log('Tipo de conexão:', state.type);
  console.log('Está conectado?', state.isConnected);
  return state.isConnected || false;  // Se isConnected for null ou undefined, retorna false
};

// Função para salvar e-mails offline primeiro
export const salvarEmailOffline = async (ronda: any) => {
  try {
    const emailsOffline = await AsyncStorage.getItem('emailsOffline');
    const emails = emailsOffline ? JSON.parse(emailsOffline) : [];
    
    emails.push(ronda);
    await AsyncStorage.setItem('emailsOffline', JSON.stringify(emails));

    console.log('E-mail salvo offline.');

    // Verifica conexão e tenta enviar caso esteja online
    if (await verificarConexao()) {
      enviarEmailsOffline();
    }
  } catch (error) {
    console.error('Erro ao salvar e-mail offline:', error);
  }
};

// Função para enviar e-mails salvos offline
export const enviarEmailsOffline = async () => {
  try {
    const emailsOffline = await AsyncStorage.getItem('emailsOffline');
    const emails = emailsOffline ? JSON.parse(emailsOffline) : [];

    if (emails.length === 0) {
      console.log('Nenhum e-mail pendente para envio.');
      return;
    }

    // Envia cada e-mail salvo offline
    for (const email of emails) {
      await sendEmail(email);
    }

    // Após enviar, limpa os e-mails offline
    await AsyncStorage.removeItem('emailsOffline');
    console.log('Todos os e-mails pendentes foram enviados.');
  } catch (error) {
    console.error('Erro ao enviar e-mails offline:', error);
  }
};

// Função para enviar e-mails (mantém a mesma lógica)
export const sendEmail = async (ronda: any) => {
  const templateParams = {
    vigilante: ronda.vigilante,
    data: ronda.data,
    horaInicio: ronda.horaInicio,
    horaFinalizada: ronda.horaFinalizada,
    bairro: ronda.bairro,
    observacoes: ronda.observacoes,
  };

  try {
    console.log('Enviando e-mail:', templateParams);
    await emailjs.send('v-bel', 'v-rondas', templateParams, 'MEUdV4yQU2C4SWqJN');
    console.log('E-mail enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar e-mail:', JSON.stringify(error));

    // Caso falhe por falta de conexão, salva o e-mail offline
    if (!(await verificarConexao())) {
      console.log('Sem conexão, salvando o e-mail offline...');
      salvarEmailOffline(ronda);
    }
  }
};

// Monitoramento de conexão de rede (opcional, útil para debug)
export const monitorarConexao = () => {
  NetInfo.addEventListener(state => {
    console.log('Monitoramento: Conectado?', state.isConnected);
  });
};
