import { Request, Response } from "express";
import usuarioSchema from "../models/usuarioSchema";
import * as dotenv from 'dotenv';
import Validations from "../utils/validations";

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
dotenv.config();

class UsuarioController {
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
}

export default new UsuarioController();