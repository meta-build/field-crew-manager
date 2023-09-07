import { Router, Request, Response } from 'express';

const routes = Router();

routes.get('/teste', (req: Request, res: Response) => res.json({ test: 'teste de rota' }));

export default routes;