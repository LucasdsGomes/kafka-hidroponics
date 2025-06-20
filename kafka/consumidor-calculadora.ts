import { kafka } from '../configuration';

const topics = ['HIDROPONIA01', 'HIDROPONIA02'];
const groupId = 'hidroponia-calculadora-group';

interface Leitura {
  temperatura: number;
  umidade: number;
  condutividade: number;
  timestamp: string;
  bancada: string;
}

// Dados armazenados em memória por tópico
const dadosPorTopico: Record<string, Leitura[]> = {};

function calcularMedia(arr: number[]): number {
  if (arr.length === 0) return 0;
  const soma = arr.reduce((a, b) => a + b, 0);
  return soma / arr.length;
}

function calcularMediana(arr: number[]): number {
  if (arr.length === 0) return 0;
  const ordenado = [...arr].sort((a, b) => a - b);
  const meio = Math.floor(ordenado.length / 2);
  if (ordenado.length % 2 === 0) {
    return (ordenado[meio - 1] + ordenado[meio]) / 2;
  } else {
    return ordenado[meio];
  }
}

async function startConsumerCalculadora() {
  const consumer = kafka.consumer({ groupId });

  await consumer.connect();

  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: false });
    dadosPorTopico[topic] = []; // inicializa o array para cada tópico
  }

  console.log(`🤖 Consumidor Calculadora conectado e escutando: ${topics.join(', ')}`);

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const value = message.value?.toString();
        if (!value) return;

        const leitura: Leitura = JSON.parse(value);

        // Armazena leitura no array do tópico
        dadosPorTopico[topic].push(leitura);

      } catch (err) {
        console.error('Erro ao processar mensagem:', err);
      }
    },
  });

  // A cada 15 segundos imprime as médias e medianas
  setInterval(() => {
    for (const topic of topics) {
      const leituras = dadosPorTopico[topic];
      if (!leituras || leituras.length === 0) {
        console.log(`Tópico ${topic}: nenhum dado recebido ainda.`);
        continue;
      }

      const temperaturas = leituras.map(l => l.temperatura);
      const umidades = leituras.map(l => l.umidade);
      const condutividades = leituras.map(l => l.condutividade);

      console.log(`\n📊 Estatísticas para o tópico ${topic}:`);

      console.log(`- Temperatura: Média = ${calcularMedia(temperaturas).toFixed(2)} °C, Mediana = ${calcularMediana(temperaturas).toFixed(2)} °C`);
      console.log(`- Umidade: Média = ${calcularMedia(umidades).toFixed(2)} %, Mediana = ${calcularMediana(umidades).toFixed(2)} %`);
      console.log(`- Condutividade: Média = ${calcularMedia(condutividades).toFixed(2)} mS/cm, Mediana = ${calcularMediana(condutividades).toFixed(2)} mS/cm`);
    }
  }, 5000);
}

startConsumerCalculadora().catch(console.error);
