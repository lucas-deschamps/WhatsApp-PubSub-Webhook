import express, { Request, Response } from 'express';

import { publishToQueue } from './publisher/publishToQueue';
import { consumeFromQueue } from './consumer/consumeFromQueue';

const app = express();

app.use(express.json());

const port = process.env.PORT || 3333;

app.post('/', async (req: Request, res: Response): Promise<void> => {
  publishToQueue(req.body);

  console.log('request body:', req.body, '\n\n');

  console.log('\nRequest finished.');
  
  res.status(200).json({ status: 'success', statusCode: 200 });
});

app.listen(port, () => {
    console.log(`\nServer up in port ${port}.`);

    consumeFromQueue();
});
