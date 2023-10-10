import { Router } from 'express';
import UsuarioController from '../controllers/UsuarioController';
import { parse } from 'express-form-data';

const formDataMiddleware = parse();

const routes = Router();

routes.post('/usuarios', UsuarioController.new);

routes.get('/usuarios', UsuarioController.editarUsuario);

routes.put('/usuarios/:id', formDataMiddleware, UsuarioController.editarUsuario);

export default routes;