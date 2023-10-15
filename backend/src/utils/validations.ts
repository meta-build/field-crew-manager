import { Response } from "express";
import { Document, Types } from "mongoose";

import equipmentTypeSchema from "../models/equipmentTypeSchema";
import equipamentSchema from "../models/equipamentSchema";
import usuarioSchema from "../models/usuarioSchema";

import * as bcrypt from 'bcrypt';

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
        return { errorResponse: res.status(400).json({ error: 'ID não informado.' }) };
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

  public users = {
    emailValidation: async (email: string, res: Response) => {
      try {
        const userExists = await usuarioSchema.findOne({ email });

        //checar se existe usuario
        if (userExists) {
          return res.status(400).json({ error: 'Email já está em uso.' });
        };
        return undefined;
      } catch (e) {
        console.log(e);
        return undefined;
      }
    },
    MatriculaValidation: async (matricula: string, res: Response) => {
      try {
        const userExists = await usuarioSchema.findOne({ matricula });

        //checar se existe usuario
        if (userExists) {
          return res.status(400).json({ error: 'N° de Matrícula já está em uso.' });
        };
        return undefined;
      } catch (e) {
        console.log(e);
        return undefined;
      }
    },
    cpfValidation: async (cpf: string, res: Response) => {
      if (cpf.length > 12) {
        return res.status(400).json({ error: 'CPF inválido.' });
      }

      try {
        const userExists = await usuarioSchema.findOne({ cpf });

        //checar se existe usuario
        if (userExists) {
          return res.status(400).json({ error: 'CPF já está em uso.' });
        };
        return undefined;
      } catch (e) {
        console.log(e);
        return undefined;
      }
    },
    isAdminValidation: (isAdmin: any, res: Response) => {
      if (typeof isAdmin === 'boolean') {
        return undefined;
      };
      return res.status(400).json({ error: "campo isAdmin não é um booleano" });
    },
    idValidation: async (id: string, res: Response): Promise<any | { errorResponse: Response<any, Record<string, any>> }> => {
      if (!id) {
        return res.status(400).json({ error: "ID não informado." });
      };
      try {
        const user = await usuarioSchema.findById(id);
        if (!user) {
          return { errorResponse: res.status(404).json({ error: 'Usuário não encontrado.' }) };
        }
        return user;
      } catch (err) {
        // validar se ID existe
        if (err.name == "CastError") {
          return { errorResponse: res.status(404).json({ error: 'Usuário não encontrado.' }) };
        }
        return { errorResponse: res.status(500).json({ err }) };
      }
    },
    adminValidation: (isAdmin: boolean, res: Response) => {
      if (!isAdmin) {
        return res.status(401).json({ error: 'não autorizado' });
      }
      return undefined;
    },
    passwordValidation: async (userId: string, passwordInserted: string, res: Response): Promise<undefined | { errorResponse: any}> => {
      console.log('validando id...')
      const userValidation = await this.users.idValidation(userId, res);
      if (userValidation['errorResponse']) return userValidation;

      const { senha } = userValidation;

      console.log('validando senha validation...')
      try {
        const isMatch = await bcrypt.compare(passwordInserted, senha);
        console.log(isMatch);
        if (!isMatch) {
          return { errorResponse: res.sendStatus(401) };
        }
        return undefined;
      } catch (e) {
        console.log(e);
        return { errorResponse: res.status(500).json({ error: e }) };
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