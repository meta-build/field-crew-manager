import { Request, Response } from "express";
import typeSchema from "../models/typeSchema";

class TipoController {
  public async getTipos (req: Request, res: Response) {
      // lógica para retornar todos os tipos de equipamentos no bd
      // obs.: armazenar no array abaixo
    try{
      const type = await typeSchema.find();
      return res.json(type);
    } catch (error) {
      res.status(400).json({
        error: "something wrong happened",
        message: error
      });
    }
  }

  public async new (req: Request, res: Response) {
    const { tipo, serial, cidade, obs } = req.body;
    // lógica para retornar todos os tipos de equipamentos no bd
    // obs.: armazenar no array abaixo
  try{
    const type = await typeSchema.create({tipo, serial, cidade,obs});
    return res.json(type);
  } catch (error) {
    res.status(400).json({
      error: "something wrong happened",
      message: error
    });
  }
  }
}

export default new TipoController();