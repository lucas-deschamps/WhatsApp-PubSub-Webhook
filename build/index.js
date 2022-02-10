import { DateTime } from 'luxon';
import express from 'express';
import { publishToQueue } from './publisher/publishToQueue';
import { consumeFromQueue } from './consumer/consumeFromQueue';
const app = express();
app.use(express.json());
const port = process.env.PORT || 3333;
app.post('/', async (req, res) => {
    try {
        const nowPlusFiveDays = DateTime.now().setZone('America/Sao_Paulo').plus({ days: 5 }).toISO();
        req.body.fireHSM = nowPlusFiveDays;
        publishToQueue(req.body);
        console.log('INCOMING REQUEST:', req.body, '\n');
        console.log('\nRequest finished.\n');
        res.status(200).json({ status: 'success', statusCode: 200 });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ status: 'failure', statusCode: 500 });
    }
});
app.listen(port, () => {
    console.log(`\nServer up in port ${port}.`);
    consumeFromQueue();
});
