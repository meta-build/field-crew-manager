import { Request, Response } from "express";
import usuarioSchema from "../models/usuarioSchema";
import * as dotenv from 'dotenv';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
dotenv.config();

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
}

export default new UsuarioController();