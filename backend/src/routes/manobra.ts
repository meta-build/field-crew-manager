import { Router } from 'express';
import ManobraController from '../controllers/ManobraController';
import tokenValidation from '../middlewares/tokenValidation';

const routes = Router();

routes.post('/manobras', tokenValidation.anyUserVerification, ManobraController.createManobra);

routes.put('/manobras/finalizar/:id', tokenValidation.anyUserVerification, ManobraController.finalizarManobra);

routes.put('/manobras/:id', tokenValidation.adminUserVerification, ManobraController.editarManobra);

routes.get('/manobras/:id', tokenValidation.anyUserVerification, ManobraController.getManobraById);

routes.get('/manobras', tokenValidation.anyUserVerification, ManobraController.getManobras);

routes.delete('/manobras/:id', tokenValidation.adminUserVerification, ManobraController.eraseManobra);

// Rota não encontrada
routes.use((req, res) => res.status(404).json({ error: 'Requisição desconhecida.' }));

export default routes;
