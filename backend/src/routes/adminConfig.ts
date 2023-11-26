import { Router } from 'express';
import tokenValidation from '../middlewares/tokenValidation';
import AdmConfigController from '../controllers/AdmConfigController';

const routes = Router();

routes.get('/admin', tokenValidation.adminUserVerification, AdmConfigController.get);

routes.post('/admin', tokenValidation.adminUserVerification, AdmConfigController.new);

routes.put('/admin', tokenValidation.adminUserVerification, AdmConfigController.update);

export default routes;
