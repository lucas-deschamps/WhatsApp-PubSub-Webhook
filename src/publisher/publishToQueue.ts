import amqp from 'amqplib';

import { amqpServer } from '../config/connections';

export async function publishToQueue(message: Object): Promise<void> {
  try {
    const connection = await amqp.connect(amqpServer);
    const channel = await connection.createChannel();
      
    await channel.assertQueue('AV');
      
    channel.sendToQueue('AV', Buffer.from(JSON.stringify(message)));
      
    await channel.close();
    await connection.close();
  } catch (err){
    console.error(err);
  }
}
