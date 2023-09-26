import { Request, Response } from "express";
import * as dotenv from 'dotenv';
import equipmentTypeSchema from "../models/equipmentTypeSchema";

class TipoController {
  public async getTipos(req: Request, res: Response) {
    try {
      const tiposArr = await equipmentTypeSchema.find();
      const tipos = tiposArr.map(item => ({
        id: item._id,
        value: item.value
      }));

      return res.status(200).json(tipos);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  public async new(req: Request, res: Response) {
    // informações básicas do equipamento
    const { value } = req.body;

    // validação das informações recebidas
    if (!value) {
      return res.status(400).json({ error: 'campo "value" não informado.' });
    }

    try{
      const tipo = await equipmentTypeSchema.create({value});
      
      const id = tipo._id;
      return res.status(200).json({ id });
    } catch (error) {
      res.status(500).json({
        error
      });
    }
  }
}

export default new TipoController();