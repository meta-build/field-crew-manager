import { Request, Response } from "express";

class TipoController {
  public async getTipos (req: Request, res: Response) {
    try {
      // lógica para retornar todos os tipos de equipamentos no bd
      // obs.: armazenar no array abaixo
      const tipos = [];

      

      return res.status(tipos.length ? 200 : 204).json(tipos);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }
}

export default new TipoController();