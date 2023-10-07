import { Router, Request, Response } from 'express';
import tipos from './tipo';
import equipamento from './equipamento';
import manobra from './manobra';

const routes = Router();

routes.use(equipamento);
routes.use(tipos);
routes.use(manobra);

routes.use((req: Request, res: Response) => res.status(404).json({ error: 'Requisição desconhecida.'}));


export default routes;