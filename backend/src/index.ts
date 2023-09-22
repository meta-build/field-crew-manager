import * as express from 'express';
import * as cors from 'cors';
import { Request } from "express";
import routes from './routes';
import mongoose from 'mongoose';

const app = express();

mongoose.connect("mongodb://localhost:27017/api");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.use(cors<Request>);
app.listen(3001, () => console.log('rodando na porta 3001'));