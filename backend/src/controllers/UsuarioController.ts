import { Request, Response } from "express";

import usuarioSchema from "../models/usuarioSchema";

import Validations from "../utils/validations";
import { uploadImg } from "../utils/imageUploader";
import encryptPassword from "../utils/encryptPassword";

import generateToken from "../middlewares/generateToken";

interface RequestFiles extends Request {
  files: any[] | any;
}

class UsuarioController {
  public async getUsuarios(req: Request, res: Response) {
    const idUser = req.user.id;

    try {
      const usuarios = await usuarioSchema.find();
      const itens = usuarios
        .filter(user => user?.id !== idUser)
        .map(user => ({
          id: user?._id,
          nome: user?.nome,
          sobrenome: user?.sobrenome,
          matricula: user?.matricula,
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
        foto: usuario?.foto || '',
        isAdmin: usuario?.isAdmin,
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

    const matriculaAlert = await Validations.users.MatriculaValidation(matricula, res);
    if (matriculaAlert) return matriculaAlert;

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
        isNew: true,
        senha: passwordHash,
        manobrasAtivas: 0,
      });

      const id = usuario._id;

      return res.status(200).json({ id })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
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

    const user = req.user;

    if (id !== user.id && !user.isAdmin) {
      return res.status(401).json({ error: "Usuário não possui permissão." });
    }

    const { nome, sobrenome, email, telefone, matricula } = req.body;

    if (req.body.isAdmin && req.body.isAdmin !== 'true' && req.body.isAdmin !== 'false') {
      return res.status(400).json({ error: "Campo isAdmin não é um booleano" });
    };
    const isAdmin = req.body.isAdmin === 'true';

    const usuario = await usuarioSchema.findById(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (email && email !== usuario.email) {
      const emailAlert = await Validations.users.emailValidation(email, res);
      if (emailAlert) return emailAlert;
    }

    if (matricula && matricula !== usuario.matricula) {
      const matriculaAlert = await Validations.users.MatriculaValidation(matricula, res);
      if (matriculaAlert) return matriculaAlert;
    }

    let foto = '';
    if (req.files && req.files.foto) {
      const url = await uploadImg(req.files.foto);
      foto = url;
    };

    const updateFields: any = {};
    if (nome) updateFields.nome = nome;
    if (sobrenome) updateFields.sobrenome = sobrenome;
    if (email) updateFields.email = email;
    if (telefone) updateFields.telefone = telefone;
    if (matricula) updateFields.matricula = matricula;
    updateFields.isAdmin = isAdmin;
    if (foto) updateFields.foto = foto;

    try {
      const user = await usuarioSchema.findByIdAndUpdate(id, updateFields);
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
    const id = req.user.id;

    const { senhaAntiga, senhaNova } = req.body;

    const invalidFields = Validations.verifyFields({ senhaAntiga, senhaNova }, res);
    if (invalidFields) return invalidFields;

    const validation = await Validations.users.passwordValidation(id, senhaAntiga, res);
    if (validation && validation['errorResponse']) return validation['errorResponse'];

    const criptoPassword = await encryptPassword(senhaNova);

    await usuarioSchema.findByIdAndUpdate(id, { senha: criptoPassword });
    return res.sendStatus(200);
  }

  public async validateUserEmail(req: Request, res: Response) {
    const { email } = req.body;

    const invalidFieldsAlert = Validations.verifyFields({ email }, res);
    if (invalidFieldsAlert) return invalidFieldsAlert;

    try {
      const usuario = await usuarioSchema.findOne({ email });
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      const { id, nome, sobrenome } = usuario;
      return res.status(200).json({ id, nome, sobrenome });
    } catch (err) {
      if (err.name == "CastError") {
        return { errorResponse: res.status(404).json({ error: 'Usuário não encontrado.' }) };
      }
      console.log(err);
      return res.status(500).json({
        error: err
      });
    }
  }

  public async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    const invalidFieldsAlert = Validations.verifyFields({ email, senha }, res);
    if (invalidFieldsAlert) return invalidFieldsAlert;

    try {
      let newUser = false;
      const usuario = await usuarioSchema.findOne({ email });
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      const validation = await Validations.users.passwordValidation(usuario.id, senha, res);
      if (validation && validation['errorResponse']) return validation['errorResponse'];

      if (usuario.isNew === true) {
        newUser = true;
        await usuarioSchema.findOneAndUpdate({ _id: usuario._id }, { isNew: false });
      }

      const token = generateToken({ id: usuario.id, isAdmin: usuario.isAdmin });

      return res.status(200).json({
        user: {
          id: usuario.id,
          nome: usuario.nome,
          sobrenome: usuario.sobrenome,
          email: usuario.email,
          telefone: usuario.telefone,
          matricula: usuario.matricula,
          cpf: usuario.cpf,
          foto: usuario.foto,
          isAdmin: usuario.isAdmin,
          isNew: newUser,
          manobrasAtivas: usuario.manobrasAtivas ? usuario.manobrasAtivas : 0,
        },
        token
      });
    } catch (err) {
      if (err.name == "CastError") {
        return { errorResponse: res.status(404).json({ error: 'Usuário não encontrado.' }) };
      }
      console.log(err);
      return res.status(500).json({
        error: err
      });
    }
  }
}

export default new UsuarioController();