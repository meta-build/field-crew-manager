import { Router } from "express";
import TipoController from "../controllers/TipoController";

const routes = Router();

routes.get('/tipos', TipoController.getTipos);

export default routes;