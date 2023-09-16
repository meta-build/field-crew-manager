import { Router, Request, Response } from 'express';
import EquipamentoController from '../controllers/EquipamentoController';

const routes = Router();

routes.get('/equipamentos', (req: Request, res: Response) => {
  if (req.query.id) {
    return EquipamentoController.getEquipamentosById(req, res);
  }

  return EquipamentoController.getEquipamentos(req, res);
});

export default routes;