import { Request, Response } from "express";
import { Document, Types } from "mongoose";
import * as dotenv from 'dotenv';

import usuarioSchema from "../models/usuarioSchema";

import Validations from "../utils/validations";
import { uploadImg } from "../utils/imageUploader";
import { hash } from "bcrypt";

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
dotenv.config();

interface RequestFiles extends Request {
  files: any[] | any;
}

class UsuarioController {
  public async getUsuarios(req: Request, res: Response) {
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

    const invalidFieldsAlert = Validations.verifyFields({
      nome,
      sobrenome,
      email,
      telefone,
      matricula,
      cpf
    }, res);
    if (invalidFieldsAlert) return invalidFieldsAlert;

    const emailAlert = await Validations.users.emailValidation(email, res);
    if (emailAlert) return emailAlert;

    const cpfAlert = await Validations.users.cpfValidation(cpf, res);
    if (cpfAlert) return cpfAlert;

    const isAdminValidation = Validations.users.isAdminValidation(isAdmin, res);
    if (isAdminValidation) return isAdminValidation;

    try {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(cpf, salt);

      const usuario = await usuarioSchema.create({
        nome,
        sobrenome,
        email,
        telefone,
        matricula,
        cpf,
        isAdmin,
        senha: passwordHash
      });

      const id = usuario._id;

      return res.status(200).json({ id })
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error
      });
    }
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    const userValidation = await Validations.users.idValidation(id, res);
    if (userValidation['errorResponse']) return userValidation['errorResponse'];

    try {
      await usuarioSchema.deleteOne({ _id: id });
      return res.sendStatus(200);
    } catch (e) {
      console.log(e);
      return res.send(500).json({ error: e });
    }
  }

  public async editarUsuario(req: RequestFiles, res: Response) {
    const { id } = req.params;

    try {
      const { nome, sobrenome, email, telefone, matricula, cpf, isAdmin } = req.body;

      const adminValidation = await Validations.users.adminValidation(isAdmin, res);
      if (adminValidation) return adminValidation;

      const invalidFieldsAlert = Validations.verifyFields({ nome, sobrenome, email, telefone, matricula, cpf, id }, res);
      if (invalidFieldsAlert) return invalidFieldsAlert;

      const users = await usuarioSchema.findByIdAndUpdate(id, {
        nome,
        sobrenome,
        email,
        telefone,
        matricula,
        cpf,
        isAdmin
      });
      return res.status(200).json({ id: users._id });

    } catch (error) {
      if (error.name == "CastError") {
        return res.status(404).json({ error: 'ID do usuario não encontrado.' });
      }
      console.log(error)
      return res.status(500).json({ error: error })
    }
  }
}

export default new UsuarioController();