import { enviarLeitura } from '../../kafka/producer';

(async () => {
  const leitura: any = {
    temperatura: +(Math.random() * 30 + 15).toFixed(2),
    umidade: +(Math.random() * 50 + 30).toFixed(2),
    condutividade: +(Math.random() * 2 + 1).toFixed(2)
  };
  await enviarLeitura(leitura, 'H03');
})();