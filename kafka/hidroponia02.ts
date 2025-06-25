import { producer } from '../configuration';

interface Leitura {
  temperatura: number;
  umidade: number;
  condutividade: number;
}

function gerarLeitura(): Leitura {
  return {
    temperatura: +(Math.random() * (100 - 10) + 10).toFixed(2),
    umidade: +(Math.random() * (100 - 10) + 10).toFixed(2),
    condutividade: +(Math.random() * (100 - 10) + 10).toFixed(2),
  };
}

(async () => {
  const leitura = gerarLeitura();
  const mensagem = {
    bancada: 'HIDROPONIA02',
    ...leitura,
  };

  await producer.connect();
  await producer.send({
    topic: 'HIDROPONIA02',
    messages: [{ key: 'bancada-HIDROPONIA02', value: JSON.stringify(mensagem) }],
  });
  await producer.disconnect();
  console.log('✔️ Leitura gerada e enviada');
})();