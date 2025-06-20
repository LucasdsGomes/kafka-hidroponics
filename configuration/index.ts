import { Consumer, Kafka, KafkaConfig, Partitioners, Producer } from 'kafkajs';

const config: KafkaConfig = {
  clientId: 'hidroponia-app',
  brokers: ['localhost:9092'], // usamos a porta mapeada para a máquina local
};

export const kafka = new Kafka(config);

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
const consumer: Consumer = kafka.consumer({ groupId: 'hidroponia-group'});
const consumerB: Consumer = kafka.consumer({ groupId: 'hidroponia-group-B'});

export {
  producer,
  consumer,
  consumerB
};
