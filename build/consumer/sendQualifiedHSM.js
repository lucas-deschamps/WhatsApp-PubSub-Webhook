import fetch from 'node-fetch';
import { hsmEndpoint } from '../config/endpoints';
async function sendQualifiedHSM(name, phoneNumber, rabbitChannel, queuedRabbitMsg) {
    const qualifiedHsmBody = {
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
    const fetchOptions = {
        method: 'POST',
        body: JSON.stringify(qualifiedHsmBody),
        headers: {
            'Authorization': process.env.AUTH_TOKEN,
            'Content-Type': 'application/json',
        },
    };
    try {
        const post = await fetch(hsmEndpoint, fetchOptions);
        const response = await post.json();
        console.log('\nRES:', response);
        rabbitChannel.ack(queuedRabbitMsg);
        queuedRabbitMsg = null;
    }
    catch (err) {
        console.error(err);
    }
}
export default sendQualifiedHSM;
