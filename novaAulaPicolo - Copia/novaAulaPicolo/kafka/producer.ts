import { producer } from './config';

export async function enviarLeitura(leitura: any, origem: string) {
  await producer.connect();
  await producer.send({
    topic: 'leituras',
    messages: [{
      key: origem,
      value: JSON.stringify(leitura),
    }],
  });
  await producer.disconnect();
}