import { Kafka, KafkaConfig, Partitioners, Consumer } from 'kafkajs';

const config: KafkaConfig = {
  clientId: 'hidroponia-app',
  brokers: ['localhost:9092'],
};

export const kafka = new Kafka(config);
export const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
export const consumer: Consumer = kafka.consumer({ groupId: 'hidroponia-group' });
//export const consumerB: Consumer = kafka.consumer({ groupId: 'hidroponia-group-B'});