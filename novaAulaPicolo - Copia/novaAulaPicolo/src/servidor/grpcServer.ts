import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { calcularMediaMediana } from './servicoCalculo';

const packageDefinition = protoLoader.loadSync('../../proto/bancada.proto');
const proto: any = grpc.loadPackageDefinition(packageDefinition);

function Calcular(call: any, callback: any) {
  const leituras = call.request.leituras;
  const resultado = calcularMediaMediana(leituras);
  callback(null, resultado);
}

const server = new grpc.Server();
server.addService(proto.CalculoService.service, { Calcular });

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
});