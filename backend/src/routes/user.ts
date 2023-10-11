import { Router} from 'express';
import UsuarioController from '../controllers/UsuarioController';
import { parse } from 'express-form-data';

const formDataMiddleware = parse();

const routes = Router();

routes.get('/usuarios', UsuarioController.getUsuarios);

routes.get('/usuarios/:id', UsuarioController.getUsuarioById);

routes.delete('/usuarios/:id', UsuarioController.delete);

routes.post('/usuarios', UsuarioController.new);

routes.put('/usuarios/:id', formDataMiddleware, UsuarioController.editarUsuario);

export default routes;