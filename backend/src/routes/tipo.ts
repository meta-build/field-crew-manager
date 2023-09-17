import { Router } from "express";
import TipoController from "../controllers/TipoController";

const routes = Router();

routes.get('/tipos', TipoController.getTipos);
routes.post('/tipos', TipoController.new);

export default routes;