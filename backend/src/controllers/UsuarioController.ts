import { Request, Response } from "express";
import { Document, Types } from "mongoose";

import equipamentSchema from "../models/equipamentSchema";

import Validations from "../utils/validations";
import { uploadImg } from "../utils/imageUploader";
import usuarioSchema from "../models/usuarioSchema";

interface RequestFiles extends Request {
  files: any[] | any;
}

class UsuarioController {
  public async getUsuarios(req: RequestFiles, res: Response) {
    try {
      const usuarios = await usuarioSchema.find();
      const itens = usuarios
      .map(user => ({
          id: user?._id,
          nome: user?.sobrenome,
          sobrenome: user?.sobrenome,
          foto: user?.foto ? user?.foto : '',
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

  public async getUsuarioById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const usuario = await usuarioSchema.findById(id);
      return res.status(200).json({
        id: usuario?._id,
        nome: usuario?.nome,
        sobrenome: usuario?.sobrenome,
        email: usuario?.email,
        telefone: usuario?.telefone,
        matricula: usuario?.matricula,
        cpf: usuario?.cpf,
        foto: usuario?.foto || ''
      });
    } catch (error) {
      if (error.name == "CastError") {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
      return res.status(500).json({ error });
    }
  }

  public async new(req: Request, res: Response) {
    // informações básicas do usuário
    const { nome, sobrenome, email, telefone, matricula, cpf, isAdmin } = req.body;

    // validação das informações recebidas
    const invalidFieldsAlert = Validations.verifyFields({ nome, sobrenome, email, telefone, matricula, cpf }, res);
    if (invalidFieldsAlert) return invalidFieldsAlert;

    try {
      const usuario = await usuarioSchema.create({
        nome, sobrenome, email, telefone, matricula, cpf, isAdmin, senha: cpf
      });

      const id = usuario._id;
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
      const { tipo, serial, cidade, obs } = req.body;

      // validação das informações recebidas
      const invalidFieldsAlert = Validations.verifyFields({ tipo, serial, cidade, obs, id }, res);
      if (invalidFieldsAlert) return invalidFieldsAlert;

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
        cidade,
        obs,
        imgs
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

export default new UsuarioController();