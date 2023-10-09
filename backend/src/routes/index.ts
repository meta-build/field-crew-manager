import { Router, Request, Response } from 'express';
import tipos from './tipo';
import equipamento from './equipamento';
import user from './user'

const routes = Router();

routes.use(equipamento);
routes.use(tipos);
routes.use(user);
routes.use((req: Request, res: Response) => res.status(404).json({ error: 'Requisição desconhecida.'}));

export default routes;