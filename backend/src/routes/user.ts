import { Router, Request, Response } from 'express';
import EquipamentoController from '../controllers/EquipamentoController';
import { parse } from 'express-form-data';
import UsuarioController from '../controllers/UsuarioController';

const routes = Router();

const formDataMiddleware = parse();

routes.get('/usuarios', UsuarioController.getEquipamentos);

routes.get('/usuarios/:id', UsuarioController.getEquipamentosById);

routes.post('/usuarios', UsuarioController.new);

routes.put('/usuarios/:id', formDataMiddleware, UsuarioController.update);

routes.put('/usuarios/ativar/:id', formDataMiddleware, UsuarioController.active);

routes.put('/usuarios/desativar/:id', formDataMiddleware, UsuarioController.desactive);

export default routes;