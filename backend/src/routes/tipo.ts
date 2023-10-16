import { Router } from 'express';
import TipoController from '../controllers/TipoController';
import tokenValidation from '../middlewares/tokenValidation';

const routes = Router();

routes.get('/tipos', tokenValidation.anyUserVerification,TipoController.getTipos);

routes.post('/tipos', tokenValidation.anyUserVerification,TipoController.new);

export default routes;
