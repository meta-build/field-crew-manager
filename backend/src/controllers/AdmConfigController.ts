import { Request, Response } from "express";

import adminConfigSchema from "../models/adminConfigSchema";

class AdminConfigController {
  public async get(req: Request, res: Response) {
    try {
      const config = await adminConfigSchema.findOne();

      return res.status(200).json(config);
    } catch (error) {
      return res.status(500).json({
        error
      });
    }
  }

  public async new (req: Request, res: Response) {
    const { maxActiveManeuvers,  defaultManeuverFilter, defaultEquipmentFilter } = req.body;

    try {
      const retorno = await adminConfigSchema.create({
        maxActiveManeuvers,
        defaultEquipmentFilter,
        defaultManeuverFilter,
      });

      return res.status(200).json({ id: retorno._id });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
  
  public async update (req: Request, res: Response) {
    const { maxActiveManeuvers,  defaultManeuverFilter, defaultEquipmentFilter } = req.body;

    try {
      const retorno = await adminConfigSchema.updateOne({}, {
        maxActiveManeuvers,
        defaultEquipmentFilter,
        defaultManeuverFilter,
      });

      console.log(retorno);
    
      return res.sendStatus(200);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}

export default new AdminConfigController();