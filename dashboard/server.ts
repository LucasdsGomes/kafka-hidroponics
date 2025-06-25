const express = require('express')
import { Request, Response } from 'express';
const path = require('path');
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const app = express();
const PORT = 3000;

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// gRPC setup
const PROTO_PATH = path.join(__dirname, '../proto/hidroponia.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObj = grpc.loadPackageDefinition(packageDef) as any;
const client = new grpcObj.hidroponia.HidroponiaService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

// Helper para obter estatísticas de um tópico
function obterEstatisticas(topico: string): Promise<any> {
  return new Promise((resolve, reject) => {
    client.CalcularEstatisticas({ topico, leituras: [] }, (err: any, res: any) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

app.get('/', async (req: Request, res: Response) => {
  try {
    const [stats01, stats02, stats03] = await Promise.all([
      obterEstatisticas('HIDROPONIA01'),
      obterEstatisticas('HIDROPONIA02'),
      obterEstatisticas('HIDROPONIA03')
    ]);

    res.render('index', {
      estatisticas: {
        HIDROPONIA01: stats01,
        HIDROPONIA02: stats02,
        HIDROPONIA03: stats03
      }
    });
  } catch (err) {
    res.status(500).send('Erro ao obter estatísticas.');
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Dashboard rodando em http://localhost:${PORT}`);
});
