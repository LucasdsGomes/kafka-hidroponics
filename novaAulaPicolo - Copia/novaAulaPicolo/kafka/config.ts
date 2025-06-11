import { Kafka, KafkaConfig } from 'kafkajs';

const config: KafkaConfig = {
  brokers: ['localhost:9092'],
};

const kafka = new Kafka(config);
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'grupo-hidroponia' });

export { producer, consumer };