import { config } from "dotenv";

config();

export const amqpServer = `amqp://${process.env.RABBITMQ_DEV_USR}:${process.env.RABBITMQ_DEV_PSS}@${process.env.RABBITMQ_DEV_URI}:${process.env.RABBITMQ_DEV_PORT}`;
export const amqpPrdServer = `amqp://${process.env.RABBITMQ_PRD_USR}:${process.env.RABBITMQ_PRD_PSS}@${process.env.RABBITMQ_PRD_URI}:${process.env.RABBITMQ_PRD_PORT}`;
