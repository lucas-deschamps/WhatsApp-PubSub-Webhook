import express from 'express';
import fetch, { Response, RequestInit } from 'node-fetch';

import { hsmEndpoint } from './config/endpoints';
import { amqpServer } from './config/connections';

import { publishToQueue } from './publisher/publishToQueue';
import { consumeFromQueue } from './consumer/consumeFromQueue';

const app = express();

app.use(express.json());

const port = process.env.PORT || 3333;

console.log(`=== ${amqpServer} ===`);

app.post('/', async (req, res) => {
  const { nome: hsmName, telefone } = req.body;

  publishToQueue(req.body);

  console.log('request body:', req.body, '\n\n');
  console.log(hsmName, telefone);

  let hsmPhoneNumber = telefone;

  if (telefone.substring(0, 2) !== '55')
    hsmPhoneNumber = '55'.concat(telefone);

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

  /*
  try {
    const post: Response = await fetch(hsmEndpoint, postOptions);
    const response: any = await post.json();

    console.log('\nsuccess msg:', response?.msg);

    res.status(200).json({ status: 'success', statusCode: 200 });
  } catch (err) {
    console.error(err);

    res.status(500).json({ status: 'failure', statusCode: 500 });
  };
  */

  console.log('\nRequest finished.');
  res.status(200).json({ status: 'success', statusCode: 200 });
});

app.listen(port, () => {
    console.log(`\nServer up in port ${port}.`);

    consumeFromQueue();
});
