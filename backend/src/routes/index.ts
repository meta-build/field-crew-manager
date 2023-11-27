import { Router, Request, Response } from 'express';
import tipos from './tipo';
import equipamento from './equipamento';
import manobra from './manobra';
import user from './user'
import admin from './adminConfig';

const routes = Router();

routes.use(equipamento);
routes.use(tipos);
routes.use(manobra);
routes.use(user);
routes.use(admin);
routes.use((req: Request, res: Response) => res.status(404).json({ error: 'Requisição desconhecida.'}));


export default routes;