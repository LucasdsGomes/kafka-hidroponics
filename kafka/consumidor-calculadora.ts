import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../proto/hidroponia.proto');
const pkgDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(pkgDef) as any;
const service = grpcObj.hidroponia.HidroponiaService;

function calcularMedia(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function calcularMediana(arr: number[]) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

const server = new grpc.Server();

server.addService(service.service, {
  CalcularEstatisticas: (call: any, callback: any) => {
    const leituras = call.request.leituras;
    const temperaturas = leituras.map((l: any) => l.temperatura);
    const umidades = leituras.map((l: any) => l.umidade);
    const conds = leituras.map((l: any) => l.condutividade);
    //console.log('📡 Requisição recebida para cálculo:', call.request);

    callback(null, {
      mediaTemperatura: calcularMedia(temperaturas),
      medianaTemperatura: calcularMediana(temperaturas),
      mediaUmidade: calcularMedia(umidades),
      medianaUmidade: calcularMediana(umidades),
      mediaCondutividade: calcularMedia(conds),
      medianaCondutividade: calcularMediana(conds),
    });
  },
});


server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
  console.log('🚀 Servidor de cálculo gRPC rodando em localhost:50051');
});