import { config } from "dotenv";
config();
export const amqpServer = `amqp://${process.env.RABBITMQ_USR}:${process.env.RABBITMQ_PSS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
export const amqpDevServer = `amqp://${process.env.RABBITMQ_DEV_USR}:${process.env.RABBITMQ_DEV_PSS}@${process.env.RABBITMQ_DEV_HOST}:${process.env.RABBITMQ_DEV_PORT}`;
export const amqpPrdServer = `amqp://${process.env.RABBITMQ_PRD_USR}:${process.env.RABBITMQ_PRD_PSS}@${process.env.RABBITMQ_PRD_HOST}:${process.env.RABBITMQ_PRD_PORT}`;
console.log(`\n\n== Connection: ${amqpServer} ==\n`);
