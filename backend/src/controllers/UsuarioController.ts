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
  public async new(req: Request, res: Response) {
    // informações básicas do usuário
    const { nome, sobrenome, email, telefone, matricula, cpf, senha, isAdmin } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'campo "Nome" não informado.' });
    }

    if (!sobrenome) {
      return res.status(400).json({ error: 'campo "Sobrenome" não informado.' });
    }

    if (!email) {
      return res.status(400).json({ error: 'campo "email" não informado.' });
    }

    if (!telefone) {
      return res.status(400).json({ error: 'campo "telefone" não informado.' });
    }

    if (!matricula) {
      return res.status(400).json({ error: 'campo "matricula" não informado.' });
    }

    if (!cpf) {
      return res.status(400).json({ error: 'campo "CPF" não informado.' });
    }

    if (!senha) {
      return res.status(400).json({ error: 'campo "senha" não informado.' });
    }

    if (!isAdmin) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const userExists = await usuarioSchema.findOne({ email: email });

    //checar se existe usuario
    if (userExists) {
      return res.status(400).json({ error: 'email já está em uso, utilize outro' });
    }

    try {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(senha, salt);
      const usuario = await usuarioSchema.create({
        nome, sobrenome, email, telefone, matricula, cpf, isAdmin, senha: cpf && passwordHash
      });

      const id = usuario._id

      try {

        const secret = process.env.SECRET
        const token = jwt.sign({
          id: usuario._id
        },
          secret
        );

        return res.status(200).json({ id, token })
      } catch (error) {
        res.status(500).json({ msg: "não foi possivel criar token" })
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error
      });
    }
  }

  public async editarUsuario(req: RequestFiles, res: Response) {
    const { id } = req.params;

    try {
      const { nome, sobrenome, email, telefone, matricula, cpf, isAdmin } = req.body;

      const adminValidation = await Validations.user.adminValidation(isAdmin as string, res);
      if(adminValidation) return adminValidation;

      const invalidFieldsAlert = Validations.verifyFields({ nome, sobrenome, email, telefone, matricula, cpf, id }, res);
      if (invalidFieldsAlert) return invalidFieldsAlert;

      const imgsValidation = Validations.user.imageArrayValidation(req.files, res);
      if (imgsValidation['errorResponse']) return imgsValidation['errorResponse'];

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

      const users = await usuarioSchema.findByIdAndUpdate(id, {
        nome,
        sobrenome,
        email,
        telefone,
        matricula,
        cpf,
        isAdmin,
        imgs
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