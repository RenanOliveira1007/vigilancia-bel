import emailjs from 'emailjs-com';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Função para salvar e-mails offline primeiro
export const salvarEmailOffline = async (ronda: any) => {
  try {
    const emailsOffline = await AsyncStorage.getItem('emailsOffline');
    const emails = emailsOffline ? JSON.parse(emailsOffline) : [];
    
    emails.push(ronda);
    await AsyncStorage.setItem('emailsOffline', JSON.stringify(emails));

    console.log('E-mail salvo offline.');

    // Verifica conexão e tenta enviar caso esteja online
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        enviarEmailsOffline();
      }
    });

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

    for (const email of emails) {
      await sendEmail(email); // Envia os e-mails armazenados
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
    await emailjs.send('v-bel', 'v-rondas', templateParams, 'MEUdV4yQU2C4SWqJN');
    console.log('E-mail enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
};
