import { kafka } from '../configuration'; // seu Kafka instance
import { KafkaMessage } from 'kafkajs';

const topic = 'HIDROPONIA02';
const groupId = 'hidroponia-group-B';

async function startConsumer() {
  const consumer = kafka.consumer({ groupId });

  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: false }); // Mostrar histórico de bancadas já rodadas

  await consumer.run({
    eachMessage: async ({ topic, partition, message }: any) => {
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
