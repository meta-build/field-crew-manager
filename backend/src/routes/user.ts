import { Router} from 'express';
import UsuarioController from '../controllers/UsuarioController';
import { parse } from 'express-form-data';
import tokenValidation from '../middlewares/tokenValidation';

const formDataMiddleware = parse();

const routes = Router();

routes.get('/usuarios', tokenValidation.adminUserVerification, UsuarioController.getUsuarios);

routes.get('/usuarios/:id', tokenValidation.anyUserVerification, UsuarioController.getUsuarioById);

routes.delete('/usuarios/:id', tokenValidation.adminUserVerification, UsuarioController.delete);

routes.post('/usuarios', tokenValidation.adminUserVerification, UsuarioController.new);

routes.put('/usuarios/:id', formDataMiddleware, tokenValidation.adminUserVerification, UsuarioController.editarUsuario);

routes.put('/usuarios/senha/:id', tokenValidation.anyUserVerification, UsuarioController.editarSenha);

routes.post('/usuarios/login/email', UsuarioController.validateUserEmail);

routes.post('/usuarios/login', UsuarioController.login);

export default routes;