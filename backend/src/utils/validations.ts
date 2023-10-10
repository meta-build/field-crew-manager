import { Response } from "express";
import equipmentTypeSchema from "../models/equipmentTypeSchema";
import { Document, Types } from "mongoose";
import equipamentSchema from "../models/equipamentSchema";

class Validations {
  public equipments = {
    statusValidation: (status: string, res: Response) => {
      if (status && status !== 'ativo' && status !== 'inativo') {
        return res.status(400).json({ error: 'Parâmetro "status" inválido.' });
      }
      return undefined;
    },
    imageArrayValidation: (files: any, res: Response): any[] | { errorResponse: Response<any, Record<string, any>> } => {
      if (!files) {
        return { errorResponse: res.status(400).json({ error: 'Equipamento precisa ter no mínimo 1 foto.' }) };
      }
      const { images } = files;
      const imagens = Array.isArray(images) ? images : images ? [images] : [];

      if (!imagens.length) {
        return { errorResponse: res.status(400).json({ error: 'Equipamento precisa ter no mínimo 1 foto.' }) };
      }

      return imagens;
    },
    idValidation: async (id: string, res: Response): Promise<any | { errorResponse: Response<any, Record<string, any>> }> => {
      if (!id) {
        return { errorResponse: res.status(400).json({ error: 'ID não informado.' })};
      }
      try {
        const equip = await equipamentSchema.findById(id);
        if (!equip) {
          return { errorResponse: res.status(404).json({ error: 'Equipamento não encontrado.' }) };
        }
        return equip;
      } catch (err) {
        // validar se ID existe
        if (err.name == "CastError") {
          return { errorResponse: res.status(404).json({ error: 'Equipamento não encontrado.' }) };
        }
        return { errorResponse: res.status(500).json({ err }) };
      }
    }
  }

  public equipmentTypes = {
    idValidation: async (tipo: string, res: Response): Promise<Document<unknown, {}, { value?: string; }> & { value?: string; } & { _id: Types.ObjectId; } | { errorResponse: Response<any, Record<string, any>> }> => {
      try {
        const equipmentType = await equipmentTypeSchema.findById(tipo);
        if (!equipmentType) {
          return { errorResponse: res.status(404).json({ error: 'ID do Tipo de equipamento não encontrado.' }) };
        }
        return equipmentType;
      } catch (error) {
        if (error.name == "CastError") {
          return { errorResponse: res.status(404).json({ error: 'ID do Tipo de equipamento não encontrado.' }) };
        }
        return { errorResponse: res.status(500).json({ error }) };
      }
    }
  }

  public verifyFields(fields: object, res: Response) {
    for (const key of Object.keys(fields)) {
      if (!fields[key]) return res.status(400).json({ error: `Campo ${key} não informado.` });
    }
    return undefined;
  }
}

export default new Validations();