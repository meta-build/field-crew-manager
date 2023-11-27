import { Router} from 'express';
import { parse } from 'express-form-data';
import UsuarioController from '../controllers/UsuarioController';
import tokenValidation from '../middlewares/tokenValidation';

const formDataMiddleware = parse();

const routes = Router();

routes.get('/usuarios', tokenValidation.adminUserVerification, UsuarioController.getUsuarios);

routes.get('/usuarios/:id', tokenValidation.anyUserVerification, UsuarioController.getUsuarioById);

routes.delete('/usuarios/:id', tokenValidation.adminUserVerification, UsuarioController.delete);

routes.post('/usuarios', tokenValidation.adminUserVerification, UsuarioController.new);

routes.put('/usuarios/:id', formDataMiddleware, tokenValidation.anyUserVerification, UsuarioController.editarUsuario);

routes.put('/usuarios/login/senha', tokenValidation.anyUserVerification, UsuarioController.editarSenha);

routes.post('/usuarios/login/email', UsuarioController.validateUserEmail);

routes.post('/usuarios/login', UsuarioController.login);

routes.post('/usuarios/esqueciSenha/:id_usuario', UsuarioController.esqueciSenha);

export default routes;
