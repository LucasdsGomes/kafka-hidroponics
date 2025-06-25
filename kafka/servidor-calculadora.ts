import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../proto/hidroponia.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;
const service = grpcObj.hidroponia.HidroponiaService;

// Funções auxiliares de cálculo
function calcularMedia(arr: number[]) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function calcularMediana(arr: number[]) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// Armazena estatísticas calculadas mais recentes por tópico
const estatisticasPorTopico: Record<string, any> = {};

const server = new grpc.Server();

server.addService(service.service, {
  CalcularEstatisticas: (call: any, callback: any) => {
    const { topico, leituras } = call.request;

    // Se não houver leituras, retornar os últimos dados em cache
    if (!leituras || leituras.length === 0) {
      const stats = estatisticasPorTopico[topico];
      if (stats) {
        return callback(null, stats);
      } else {
        return callback(null, {
          mediaTemperatura: 0,
          medianaTemperatura: 0,
          mediaUmidade: 0,
          medianaUmidade: 0,
          mediaCondutividade: 0,
          medianaCondutividade: 0,
        });
      }
    }

    // Calcula com os dados recebidos
    const temperaturas = leituras.map((l: any) => l.temperatura);
    const umidades = leituras.map((l: any) => l.umidade);
    const condutividades = leituras.map((l: any) => l.condutividade);

    const resultado = {
      mediaTemperatura: calcularMedia(temperaturas),
      medianaTemperatura: calcularMediana(temperaturas),
      mediaUmidade: calcularMedia(umidades),
      medianaUmidade: calcularMediana(umidades),
      mediaCondutividade: calcularMedia(condutividades),
      medianaCondutividade: calcularMediana(condutividades),
    };

    // Armazena no cache
    estatisticasPorTopico[topico] = resultado;

    callback(null, resultado);
  }
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log('🚀 Servidor de cálculo gRPC rodando em http://localhost:50051');
});
