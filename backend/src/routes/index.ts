import { Router, Request, Response } from 'express';
import equipamentos from './equipamento';
import tipo from './tipo';

const routes = Router();

routes.use(equipamentos);
routes.use(tipo);
routes.get('/teste', (req: Request, res: Response) => res.json({ test: 'teste de rota' }));

export default routes;