import { Request, Response } from "express";
import { Document, Types } from "mongoose";

import equipamentSchema from "../models/equipamentSchema";

import Validations from "../utils/validations";
import { uploadImg } from "../utils/imageUploader";
import manobraSchema from "../models/manobraSchema";

interface RequestFiles extends Request {
  files: any[] | any;
}

class EquipamentoController {
  public async getEquipamentos(req: RequestFiles, res: Response) {
    const { status, tipo } = req.query;

    const invalidStatusAlert = Validations.equipments.statusValidation(status as string, res);
    if (invalidStatusAlert) return invalidStatusAlert;

    if (tipo) {
      const invalidTypeId = await Validations.equipmentTypes.idValidation(tipo as string, res);
      if (invalidTypeId['errorResponse']) return invalidTypeId['errorResponse'];
    }

    try {
      const equipamentos = await equipamentSchema.find();
      const itens = equipamentos
        .filter(equip => {
          const statusFilter = Boolean(status) ? (status == 'ativo' ? equip.isActive : !equip.isActive) : true;
          const tipoFilter = Boolean(tipo) ? tipo == equip.tipo.id : true;

          return statusFilter && tipoFilter;
        })
        .map(equip => ({
          id: equip._id,
          tipo: equip.tipo,
          serial: equip.serial,
          status: equip.isActive ? 'ativo' : 'inativo',
          img: equip.imgs[0],
          latitude: equip.latitude,
          longitude: equip.longitude
        }));
      res.status(200).json({
        values: itens,
        metadata: {
          itens: itens.length,
        }
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  public async getEquipamentosById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const manobrasBD = await manobraSchema.find({ equipamentos: id })
      const manobras = manobrasBD.map(manobra => ({
        id: manobra.id,
        titulo: manobra.titulo,
        datetimeFim: manobra.datetimeFim,
        usuario: manobra.funcionario,
      }));

      const equipamento = await equipamentSchema.findById(id);
      return res.status(200).json({
        id: equipamento._id,
        tipo: equipamento.tipo,
        serial: equipamento.serial,
        obs: equipamento.obs,
        status: equipamento.isActive ? 'ativo' : 'inativo',
        imgs: equipamento.imgs,
        manobras: manobras,
        latitude: equipamento.latitude,
        longitude: equipamento.longitude
      });
    } catch (error) {
      if (error.name == "CastError") {
        return res.status(404).json({ error: 'Equipamento não encontrado.' });
      }
      return res.status(500).json({ error });
    }
  }

  public async new(req: RequestFiles, res: Response) {
    // informações básicas do equipamento
    const { tipo, serial, obs, latitude, longitude } = req.body;

    const isActive = true;

    // validação das informações recebidas
    const invalidFieldsAlert = Validations.verifyFields({ tipo, serial, obs, latitude, longitude }, res);
    if (invalidFieldsAlert) return invalidFieldsAlert;

    // validação das coordenadas
    const invalidCoords = Validations.coordsValidation({ latitude, longitude }, res);
    if (invalidCoords) return invalidCoords;

    // validação se existe tipo (se não existir o tipo, deve retornar true para retornar o erro)
    const tipoValidation = await Validations.equipmentTypes.idValidation(tipo as string, res);
    if (tipoValidation['errorResponse']) return tipoValidation['errorResponse'];

    const tipoObj = tipoValidation as Document<unknown, {}, {
      value?: string;
    }> & {
      value?: string;
    } & {
      _id: Types.ObjectId;
    }

    // armazenamento das fotos do equipamento na api IMGUR
    const imgsValidation = Validations.equipments.imageArrayValidation(req.files, res);
    if (imgsValidation['errorResponse']) return imgsValidation['errorResonse'];

    const imagens = imgsValidation as any[];

    const imgs = [];
    for (const img of imagens) {
      try {
        const url = await uploadImg(img);
        imgs.push(url);
      } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err });
      }
    }

    try {
      const equipamento = await equipamentSchema.create({
        tipo: {
          id: tipoObj._id,
          value: tipoObj.value
        },
        serial,
        obs,
        isActive,
        imgs,
        latitude,
        longitude
      });

      const id = equipamento._id;
      return res.status(200).json({ id });
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error
      });
    }
  }

  public async update(req: RequestFiles, res: Response) {
    const { id } = req.params;

    try {
      const { tipo, serial, obs, latitude, longitude } = req.body;

      // validação das informações recebidas
      const invalidFieldsAlert = Validations.verifyFields({ tipo, serial, obs, id }, res);
      if (invalidFieldsAlert) return invalidFieldsAlert;

      // validação das coordenadas
      const invalidCoords = Validations.coordsValidation({ latitude, longitude }, res);
      if (invalidCoords) return invalidCoords;

      // validação se existe tipo (se não existir o tipo, deve retornar true para retornar o erro)
      const tipoValidation = await Validations.equipmentTypes.idValidation(tipo as string, res);
      if (tipoValidation['errorResponse']) return tipoValidation['errorResponse'];

      const tipoObj = tipoValidation as Document<unknown, {}, {
        value?: string;
      }> & {
        value?: string;
      } & {
        _id: Types.ObjectId;
      }

      // armazenamento das fotos do equipamento na api IMGUR
      const imgsValidation = Validations.equipments.imageArrayValidation(req.files, res);
      if (imgsValidation['errorResponse']) return imgsValidation['errorResonse'];

      const imagens = imgsValidation as any[];
      const imgs = [];

      for (const img of imagens) {
        try {
          const url = await uploadImg(img);
          imgs.push(url);
        } catch (err) {
          return res.status(500).json({ error: err });
        }
      }

      const equipamento = await equipamentSchema.findByIdAndUpdate(id, {
        tipo: {
          id: tipo,
          value: tipoObj.value,
        },
        serial,
        obs,
        imgs,
        latitude,
        longitude
      });
      return res.status(200).json({ id: equipamento._id });

    } catch (error) {
      if (error.name == "CastError") {
        return res.status(404).json({ error: 'ID do equipamento não encontrado.' });
      }
      return res.status(500).json({ error });
    }
  }

  public async active(req: Request, res: Response) {
    const { id } = req.params;

    const equipValidation = await Validations.equipments.idValidation(id, res);
    if (equipValidation['errorResponse']) return equipValidation['errorResponse'];

    const equip = equipValidation as any;

    // se equipamento já estiver ativo, condição do if abaixo deve ser true
    if (equip.isActive) {
      return res.status(409).json({ error: 'Equipamento já está ativo.' });
    }

    const isActive = true;
    const equipamento = await equipamentSchema.findByIdAndUpdate(id, { isActive });
    return res.status(200).json({ id: equipamento._id });
  }

  public async desactive(req: Request, res: Response) {
    const { id } = req.params;

    const equipValidation = await Validations.equipments.idValidation(id, res);
    if (equipValidation['errorResponse']) return equipValidation['errorResponse'];

    const equip = equipValidation as any;

    // se equipamento já estiver ativo, condição do if abaixo deve ser true
    if (!equip.isActive) {
      return res.status(409).json({ error: 'Equipamento já está inativo.' });
    }

    const isActive = false;
    const equipamento = await equipamentSchema.findByIdAndUpdate(id, { isActive });
    return res.status(200).json({ id: equipamento._id });
  }
}

export default new EquipamentoController();