import { Router } from 'express';
import { parse } from 'express-form-data';
import EquipamentoController from '../controllers/EquipamentoController';
import tokenValidation from '../middlewares/tokenValidation';

const routes = Router();

const formDataMiddleware = parse();

routes.get('/equipamentos', tokenValidation.anyUserVerification, EquipamentoController.getEquipamentos);

routes.get('/equipamentos/:id', tokenValidation.anyUserVerification, EquipamentoController.getEquipamentosById);

routes.post('/equipamentos', formDataMiddleware, tokenValidation.anyUserVerification, EquipamentoController.new);

routes.put('/equipamentos/:id', formDataMiddleware, tokenValidation.anyUserVerification, EquipamentoController.update);

routes.put('/equipamentos/ativar/:id', formDataMiddleware, tokenValidation.anyUserVerification, EquipamentoController.active);

routes.put('/equipamentos/desativar/:id', formDataMiddleware, tokenValidation.anyUserVerification, EquipamentoController.desactive);

export default routes;
