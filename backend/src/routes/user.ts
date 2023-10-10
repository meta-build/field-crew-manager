import { Router} from 'express';
import UsuarioController from '../controllers/UsuarioController';

const routes = Router();

routes.get('/usuarios', UsuarioController.getUsuarios);

routes.get('/usuarios/:id', UsuarioController.getUsuarioById);

routes.delete('/usuarios/:id', UsuarioController.delete);

routes.post('/usuarios', UsuarioController.new);

export default routes;