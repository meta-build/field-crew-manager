import { Router, Request, Response } from 'express';
import equipamentos from './equipamento';

const routes = Router();

routes.use(equipamentos);
routes.get('/teste', (req: Request, res: Response) => res.json({ test: 'teste de rota' }));

export default routes;