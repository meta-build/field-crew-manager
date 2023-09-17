import { Router, Request, Response } from 'express';
import EquipamentoController from '../controllers/EquipamentoController';
import { parse } from 'express-form-data';

const routes = Router();

const formDataMiddleware = parse();

routes.get('/equipamentos', (req: Request, res: Response) => {
  if (req.query.id) {
    return EquipamentoController.getEquipamentosById(req, res);
  }

  return EquipamentoController.getEquipamentos(req, res);
});

routes.post('/equipamentos', formDataMiddleware, EquipamentoController.new);

routes.put('/equipamentos', formDataMiddleware, EquipamentoController.update);

routes.put('/equipamentos/ativar', EquipamentoController.active);

routes.put('/equipamentos/desativar', EquipamentoController.active);

export default routes;