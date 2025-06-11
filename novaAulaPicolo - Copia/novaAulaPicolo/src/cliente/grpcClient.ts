import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, '../../proto/bancada.proto')
);
const proto: any = grpc.loadPackageDefinition(packageDefinition);

const client = new proto.CalculoService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

export function enviarParaServidorGrpc(leituras: any[]) {
  client.Calcular({ leituras }, (err: any, response: any) => {
    if (err) console.error(err);
    else console.log('Resultado:', response);
  });
}