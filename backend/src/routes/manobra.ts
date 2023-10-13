import { Router } from 'express';
import ManobraController from '../controllers/ManobraController';

const routes = Router();

routes.post('/manobras', ManobraController.createManobra);
routes.put('/manobras/finalizar/:id', ManobraController.finalizarManobra);
routes.put('/manobras/:id', ManobraController.editarManobra);
routes.get('/manobras/:id', ManobraController.getManobraById);
routes.get('/manobras', ManobraController.getManobras);
routes.delete('/manobras/:id', ManobraController.eraseManobra);

// Rota não encontrada
routes.use((req, res) => res.status(404).json({ error: 'Requisição desconhecida.' }));

export default routes;
