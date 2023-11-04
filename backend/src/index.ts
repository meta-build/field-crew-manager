import * as express from 'express';
import * as cors from 'cors';
import routes from './routes';
import { Request, Response } from 'express';
import filterByBuffer from './utils/filterByBuffer'; // Certifique-se de que este é o caminho correto para o módulo filterByBuffer


require('dotenv').config()

const app = express();

app.use(express.json());

app.post('/filterByBuffer', (req, res) => {
  const { bufferCenter, bufferRadius, itemCoords } = req.body;

  if (!bufferCenter || !bufferRadius || !itemCoords) {
    return res.status(400).json({ error: 'Parâmetros inválidos.' });
  }
  const result = filterByBuffer(bufferCenter, bufferRadius, itemCoords);
  res.json({ isWithinBuffer: result });
});

app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use(cors<Request>);

require("../src/database/index");

app.listen(3001, () => console.log('rodando na porta 3001'));