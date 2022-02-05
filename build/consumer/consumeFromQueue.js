import amqp from 'amqplib';
import { amqpServer } from '../config/connections';
export async function consumeFromQueue() {
    try {
        const connection = await amqp.connect(amqpServer);
        const channel = await connection.createChannel();
        await channel.assertQueue('AV');
        channel.consume('AV', message => {
            try {
                const msg = JSON.parse(message.content.toString('utf8'));
                console.log('\ntype:', typeof msg);
                console.log(msg);
            }
            catch (err) {
                console.error(err);
            }
        });
        console.log("\nWaiting for messages...");
    }
    catch (err) {
        console.error(err);
    }
}
