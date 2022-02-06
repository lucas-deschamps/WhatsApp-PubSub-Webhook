import express from 'express';
import { publishToQueue } from './publisher/publishToQueue';
import { consumeFromQueue } from './consumer/consumeFromQueue';
const app = express();
app.use(express.json());
const port = process.env.PORT || 3333;
app.post('/', async (req, res) => {
    const { nome: hsmName, telefone } = req.body;
    publishToQueue(req.body);
    console.log('request body:', req.body, '\n\n');
    console.log(hsmName, telefone);
    let hsmPhoneNumber = telefone;
    if (telefone.substring(0, 2) !== '55')
        hsmPhoneNumber = '55'.concat(telefone);
    console.log('\nRequest finished.');
    res.status(200).json({ status: 'success', statusCode: 200 });
});
app.listen(port, () => {
    console.log(`\nServer up in port ${port}.`);
    consumeFromQueue();
});
