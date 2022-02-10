import fetch, { Response as FetchResponse, RequestInit } from 'node-fetch';

import { IQualifiedHSM } from '../interfaces/hsm';
import { hsmEndpoint } from '../config/endpoints';

async function sendQualifiedHSM(name: string, phoneNumber: string, rabbitChannel: any, queuedRabbitMsg: any): Promise<void> {
  const qualifiedHsmBody: IQualifiedHSM = {
    "cod_conta": 6,
    "hsm": 13,
    "cod_flow": 66,
    "tipo_envio": 1,
    "variaveis": {
      "1": `${name}` || 'nome',
    },
    "contato": {
      "nome": `${name}` || 'nome',
      "telefone": `${phoneNumber}` || '5548999476359',
    },
    "start_flow": 1
  };

  console.log('\nHSM API post body:', qualifiedHsmBody, '\n');

  const fetchOptions: RequestInit = {
    method: 'POST',
    body: JSON.stringify(qualifiedHsmBody),
    headers: {
      'Authorization': process.env.AUTH_TOKEN as string,
      'Content-Type': 'application/json',
    },
  };

  try {
    const post: FetchResponse = await fetch(hsmEndpoint, fetchOptions);
    const response: any = await post.json();
  
    console.log('\nRES:', response);

    rabbitChannel.ack(queuedRabbitMsg!);

    queuedRabbitMsg = null;  
  } catch (err) {
    console.error(err);
  }
}

export default sendQualifiedHSM;