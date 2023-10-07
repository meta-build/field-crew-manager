import { Router } from 'express';
import ManobraController from '../controllers/ManobraController';

const routes = Router();

routes.post('/manobras', ManobraController.createManobra);
routes.put('/manobras/finalizar/:id', ManobraController.finalizarManobra);
routes.put('/manobras/:id', ManobraController.editarManobra);

export default routes;
