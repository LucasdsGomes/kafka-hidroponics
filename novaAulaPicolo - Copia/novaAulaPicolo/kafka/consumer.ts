import { consumer } from './config';
import { processarLeituras } from '../src/cliente';

export async function consumirLeituras() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'leituras' });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value) {
        const leitura = JSON.parse(message.value.toString());
        processarLeituras(leitura);
      }
    },
  });
}