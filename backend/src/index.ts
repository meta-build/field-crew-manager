import * as express from 'express';
import * as cors from 'cors';
import { Request } from "express";
import routes from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use(cors<Request>);
app.listen(8080, () => console.log('rodando na porta 8080'));