import { Router, Request, Response } from 'express';
import EquipamentoController from '../controllers/EquipamentoController';
import { parse } from 'express-form-data';

const routes = Router();

const formDataMiddleware = parse();

routes.get('/equipamentos', EquipamentoController.getEquipamentos);

routes.get('/equipamentos/:id', EquipamentoController.getEquipamentosById);

routes.post('/equipamentos', formDataMiddleware, EquipamentoController.new);

routes.put('/equipamentos/:id', formDataMiddleware, EquipamentoController.update);

routes.put('/equipamentos/ativar/:id', formDataMiddleware, EquipamentoController.active);

routes.put('/equipamentos/desativar/:id', formDataMiddleware, EquipamentoController.desactive);

export default routes;