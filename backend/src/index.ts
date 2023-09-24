import * as express from 'express';
import * as cors from 'cors';
import { Request } from "express";
import routes from './routes';
import mongoose from 'mongoose';

require('dotenv').config()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use(cors<Request>);

require("../src/database/index");

app.listen(3001, () => console.log('rodando na porta 3001'));