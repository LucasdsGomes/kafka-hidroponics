import { consumirLeituras } from '../../kafka/consumer';
import { enviarParaServidorGrpc } from './grpcClient';

const leituras: any[] = [];

export function processarLeituras(leitura: any) {
  leituras.push(leitura);
  if (leituras.length >= 3) {
    enviarParaServidorGrpc(leituras);
    leituras.length = 0;
  }
}

consumirLeituras();