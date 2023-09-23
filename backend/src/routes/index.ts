import { Router, Request, Response } from 'express';
import equipamentos from './equipamento';
import tipo from './tipo';

const routes = Router();

routes.use(equipamentos);
routes.use(tipo);
routes.use((req: Request, res: Response) => res.status(404).json({ error: 'Requisição desconhecida.' }));

export default routes;