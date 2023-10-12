import { Request, Response } from "express";
import * as dotenv from 'dotenv';

import usuarioSchema from "../models/usuarioSchema";

import Validations from "../utils/validations";
import { uploadImg } from "../utils/imageUploader";
import encryptPassword from "../utils/encryptPassword";

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
      const passwordHash = await encryptPassword(cpf);

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

    const { nome, sobrenome, email, telefone, matricula } = req.body;

    const invalidFieldsAlert = Validations.verifyFields({ nome, sobrenome, email, telefone, matricula, id }, res);
    if (invalidFieldsAlert) return invalidFieldsAlert;

    if (req.body.isAdmin !== 'true' && req.body.isAdmin !== 'false') {
      return res.status(400).json({ error: "Campo isAdmin não é um booleano" });
    };
    const isAdmin = req.body.isAdmin === 'true';

    let foto = '';
    if (req.files && req.files.foto) {
      const url = await uploadImg(req.files.foto);
      foto = url;
    };

    try {
      const user = await usuarioSchema.findByIdAndUpdate(id, {
        nome,
        sobrenome,
        email,
        telefone,
        matricula,
        isAdmin,
        foto
      });
      return res.status(200).json({ id: user._id });
    } catch (error) {
      if (error.name == "CastError") {
        return res.status(404).json({ error: 'ID do usuario não encontrado.' });
      }
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }

  public async editarSenha(req: Request, res: Response) {
    const { id } = req.params;

    const { senhaAntiga, novaSenha } = req.body;

    const invalidFields = Validations.verifyFields({ senhaAntiga, novaSenha }, res);
    if (invalidFields) return invalidFields;

    const validation = await Validations.users.passwordValidation(id, senhaAntiga, res);
    if (validation && validation['errorResponse']) return validation['errorResponse'];

    const criptoPassword = await encryptPassword(novaSenha);

    await usuarioSchema.findByIdAndUpdate(id, { senha: criptoPassword });
    return res.sendStatus(200);
  }
}

export default new UsuarioController();