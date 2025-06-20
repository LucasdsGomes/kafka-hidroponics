import { kafka } from '../configuration';

const topics = ['HIDROPONIA01', 'HIDROPONIA02'];
const groupId = 'hidroponia-group-c'; // apenas um groupId

async function startConsumer() {
  const consumer = kafka.consumer({ groupId });

  await consumer.connect();

  // Inscreve em múltiplos tópicos, uma chamada para cada tópico
  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: true });
  }

  console.log(`🚀 Consumidor C conectado e escutando os tópicos: ${topics.join(', ')}`);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const key = message.key?.toString();
        const value = message.value?.toString();

        if (!value) {
          console.warn('[!] Mensagem sem valor recebida.');
          return;
        }

        const leitura = JSON.parse(value);

        console.log('\n📥 Mensagem recebida do tópico:', topic);
        console.log('🔑 Chave:', key);
        console.log('📅 Timestamp:', leitura.timestamp);
        console.log('🧪 Bancada:', leitura.bancada);
        console.log('🌡️ Temperatura:', leitura.temperatura, '°C');
        console.log('💧 Umidade:', leitura.umidade, '%');
        console.log('⚡ Condutividade:', leitura.condutividade, 'mS/cm');

      } catch (err) {
        console.error('❌ Erro ao processar mensagem:', err);
      }
    },
  });
}

startConsumer().catch(console.error);
