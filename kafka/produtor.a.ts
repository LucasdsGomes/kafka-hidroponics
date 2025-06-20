import { producer } from "../configuration";

interface Leitura {
  temperatura: number;
  umidade: number;
  condutividade: number;
}

async function enviarLeitura(leitura: Leitura, bancadaId: string): Promise<void> {
  const topic = 'HIDROPONIA01';

  const mensagem = {
    bancada: bancadaId,
    timestamp: new Date().toISOString(),
    ...leitura
  };

  try {
    await producer.connect();

    await producer.send({
      topic,
      messages: [
        {
          key: `bancada-${bancadaId}`,
          value: JSON.stringify(mensagem),
        },
      ],
    });

    console.log(`[✔] Leitura da bancada ${bancadaId} enviada com sucesso!`);
    
    await producer.disconnect();
  } catch (error) {
    console.error(`[✘] Erro ao enviar leitura: ${error}`);
  }
}

// Simulação de envio de leitura (mock)
(async () => {
  const leitura: Leitura = {
    temperatura: +(Math.random() * 30 + 15).toFixed(2),
    umidade: +(Math.random() * 50 + 30).toFixed(2),
    condutividade: +(Math.random() * 2 + 1).toFixed(2),
  };

  await enviarLeitura(leitura, 'HIDROPONIA01');
})();
