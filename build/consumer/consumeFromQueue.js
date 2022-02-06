import amqp from 'amqplib';
import { amqpServer } from '../config/connections';
export async function consumeFromQueue() {
    try {
        const connection = await amqp.connect(amqpServer);
        const channel = await connection.createChannel();
        await channel.assertQueue('AV');
        channel.consume('AV', message => {
            try {
                const lead = JSON.parse(message.content.toString('utf8'));
                console.log('\ntype:', typeof lead);
                console.log(lead);
                //channel.ack(lead);
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
/*
const qualifiedBody = {
  "cod_conta": 6,
  "hsm": 13,
  "cod_flow": 62,
  "tipo_envio": 1,
  "variaveis": {
    "1": `${hsmName}` || 'nome',
  },
  "contato": {
    "nome": `${hsmName}` || 'nome',
    "telefone": `${hsmPhoneNumber}` || '5548999476359',
  },
  "start_flow": 1
};

const postOptions: RequestInit = {
  method: 'POST',
  body: JSON.stringify(qualifiedBody),
  headers: {
    'Authorization': JSON.stringify(process.env.AUTH_TOKEN),
    'Content-Type': 'application/json',
  },
};

try {
  const post: FetchResponse = await fetch(hsmEndpoint, postOptions);
  const response: any = await post.json();

  console.log('\nsuccess msg:', response?.msg);

  res.status(200).json({ status: 'success', statusCode: 200 });
} catch (err) {
  console.error(err);

  res.status(500).json({ status: 'failure', statusCode: 500 });
};
*/ 
