import { Router } from 'express';
import { parse } from 'express-form-data';
import UsuarioController from '../controllers/UsuarioController';

const routes = Router();

const formDataMiddleware = parse();

routes.get('/usuarios', UsuarioController.getUsuarios);

routes.get('/usuarios/:id', UsuarioController.getUsuarioById);

routes.post('/usuarios', UsuarioController.new);

routes.put('/usuarios/:id', formDataMiddleware, UsuarioController.update);

routes.put('/usuarios/ativar/:id', formDataMiddleware, UsuarioController.active);

routes.put('/usuarios/desativar/:id', formDataMiddleware, UsuarioController.desactive);

export default routes;