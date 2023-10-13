import { Request, Response } from "express";
import manobraSchema from "../models/manobraSchema";
import equipamentSchema from "../models/equipamentSchema";
import usuarioSchema from "../models/usuarioSchema";
import Validations from "../utils/validations";

class ManobraController {
  public async createManobra(req: Request, res: Response) {
    const idUser = req.user?.id;

    try {
      const { titulo, descricao, equipamentos, datetimeInicio } = req.body;

      const invalidFieldsAlert = Validations.verifyFields({ titulo, descricao, equipamentos, datetimeInicio }, res);
      if (invalidFieldsAlert) return invalidFieldsAlert;

      if (equipamentos.length === 0) {
        return res.status(400).json({ error: 'Pelo menos um equipamento deve ser informado.' });
      }

      const invalidEquipamentos = await Promise.all(
        equipamentos.map(async (equipamentoId) => {
          const equipamento = await equipamentSchema.findById(equipamentoId);
          return !equipamento;
        })
      );

      if (invalidEquipamentos.some((invalid) => invalid)) {
        return res.status(404).json({ error: 'Um ou mais IDs de equipamentos não foram encontrados.' });
      }

      // Obtenha o funcionário a partir do modelo de funcionário
      const usuario = await usuarioSchema.findById(idUser);

      // Crie a manobra
      const manobra = await manobraSchema.create({
        titulo,
        descricao,
        equipamentos,
        funcionario: {
          id: idUser,
          nome: usuario.nome,
          sobrenome: usuario.sobrenome,
        },
        datetimeInicio,
      });

      equipamentos.forEach(async (equipId) => {
        await equipamentSchema.findByIdAndUpdate(equipId, { isActive: false });
      });

      return res.status(201).json({ id: manobra._id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  }

  public async finalizarManobra(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { datetimeFim } = req.body;

      // Verificar se o ID da manobra existe
      const manobra = await manobraSchema.findById(id);

      if (!manobra) {
        return res.status(404).json({ error: 'Manobra não encontrada.' });
      }

      // Definindo a data e hora de término com base no que foi fornecido ou no momento atual
      const datetimeFimFinal = datetimeFim ? new Date(datetimeFim) : new Date();

      // Atualize a manobra com a data e hora de término
      await manobraSchema.findByIdAndUpdate(id, { datetimeFim: datetimeFimFinal });

      manobra.equipamentos.forEach(async (equipId) => {
        await equipamentSchema.findByIdAndUpdate(equipId, { isActive: true });
      });

      return res.status(200).json({});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  }

  public async editarManobra(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { titulo, descricao, equipamentos, datetimeInicio, datetimeFim, funcionario } = req.body;

      // Verificar se todos os campos obrigatórios estão presentes
      if (!titulo || !descricao || !equipamentos || !datetimeInicio || !funcionario) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
      }

      // Verificar se pelo menos 1 equipamento foi informado
      if (equipamentos.length === 0) {
        return res.status(400).json({ error: 'Pelo menos um equipamento deve ser informado.' });
      }

      // Verificar se os IDs dos equipamentos são válidos
      const invalidEquipamentos = await Promise.all(
        equipamentos.map(async (equipamentoId) => {
          const equipamento = await equipamentSchema.findById(equipamentoId);
          return !equipamento;
        })
      );

      if (invalidEquipamentos.some((invalid) => invalid)) {
        return res.status(404).json({ error: 'Um ou mais IDs de equipamentos não foram encontrados.' });
      }

      // Verificar se o ID da manobra existe
      const manobra = await manobraSchema.findById(id);

      if (!manobra) {
        return res.status(404).json({ error: 'Manobra não encontrada.' });
      }

      // Atualizar a manobra com os novos dados
      await manobraSchema.findByIdAndUpdate(id, {
        titulo,
        descricao,
        equipamentos,
        datetimeInicio,
        datetimeFim: datetimeFim ? new Date(datetimeFim) : undefined,
        funcionario,
      });

      return res.status(200).json({ id });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  }

  public async getManobras (req: Request, res: Response) {
    try {
      const titulo: string | undefined = req.query.titulo as string | undefined;
      let manobras;

      if (titulo) {
        // Se um título foi fornecido na consulta, filtre as manobras com base nele
        manobras = await manobraSchema.find({ titulo: { $regex: new RegExp(titulo, "i") } });
      } else {
        // Se nenhum título foi fornecido, retorne todas as manobras
        manobras = await manobraSchema.find();
      }

      const manobrasValues = manobras.map((manobra) => ({
        id: manobra._id,
        titulo: manobra.titulo,
        datetimeFim: manobra.datetimeFim ? manobra.datetimeFim.toISOString() : null,
        usuario: manobra.funcionario,
      }));

      return res.status(200).json({
        values: manobrasValues,
        metadata: {
          itens: manobras.length,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  }

  public async getManobraById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar se o ID da manobra existe
      const manobra = await manobraSchema.findById(id);

      if (!manobra) {
        return res.status(404).json({ error: 'Manobra não encontrada.' });
      }

      // Coletar informações da manobra
      const equipamentosInfo = await Promise.all(
        manobra.equipamentos.map(async (equipamentoId) => {
          const equipamento = await equipamentSchema.findById(equipamentoId);

          return {
            id: equipamento._id,
            tipo: equipamento.tipo.value,
            img: equipamento.imgs[0], // A primeira imagem
          };
        })
      );

      return res.status(200).json({
        titulo: manobra.titulo,
        descricao: manobra.descricao,
        equipamentos: equipamentosInfo,
        datetimeInicio: manobra.datetimeInicio.toISOString(),
        datetimeFim: manobra.datetimeFim ? manobra.datetimeFim.toISOString() : null,
        usuario: manobra.funcionario,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  }

  public async eraseManobra(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar se o ID da manobra existe
      const manobra = await manobraSchema.findById(id);

      if (!manobra) {
        return res.status(404).json({ error: 'Manobra não encontrada.' });
      }

      // Excluindo a manobra
      await manobraSchema.findByIdAndRemove(id);

      return res.status(200).json({});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  }
}

export default new ManobraController();