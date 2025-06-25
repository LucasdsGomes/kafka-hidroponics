import { consumer } from '../configuration';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../proto/hidroponia.proto');
const pkgDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(pkgDef) as any;
const client = new grpcObj.hidroponia.HidroponiaService('localhost:50051', grpc.credentials.createInsecure());

interface Leitura {
  temperatura: number;
  umidade: number;
  condutividade: number;
  bancada: string;
  timestamp: string;
}

// Agora armazenamos leituras separadas por bancada
const leiturasPorTopico: Record<string, Leitura[]> = {};
const topics = ['HIDROPONIA01', 'HIDROPONIA02', 'HIDROPONIA03'];

async function runConsumer() {
  await consumer.connect();

  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
  }

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const value = message.value?.toString();
      if (!value) return;

      const leitura: Leitura = JSON.parse(value);
      console.log(`📥 Leitura recebida do tópico ${topic}:`, leitura);

      if (!leiturasPorTopico[topic]) {
        leiturasPorTopico[topic] = [];
      }

      leiturasPorTopico[topic].push(leitura);

      client.CalcularEstatisticas(
        { topico: topic, leituras: leiturasPorTopico[topic] },
        (err: any, res: any) => {
          if (err) console.error('❌ Erro gRPC:', err);
          else {
            console.log(`📊 Estatísticas para ${topic}:`);
            console.log(`🌡️ Temperatura: Média = ${res.mediaTemperatura.toFixed(2)}, Mediana = ${res.medianaTemperatura.toFixed(2)}`);
            console.log(`💧 Umidade: Média = ${res.mediaUmidade.toFixed(2)}, Mediana = ${res.medianaUmidade.toFixed(2)}`);
            console.log(`⚡ Condutividade: Média = ${res.mediaCondutividade.toFixed(2)}, Mediana = ${res.medianaCondutividade.toFixed(2)}`);
          }
        }
      );
    },
  });
}

runConsumer().catch(console.error);
