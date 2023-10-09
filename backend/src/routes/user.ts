import { Router } from 'express';
import UsuarioController from '../controllers/UsuarioController';

const routes = Router();

routes.post('/usuarios', UsuarioController.new);

export default routes;