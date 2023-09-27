import axios from "axios";
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import equipamentSchema from "../models/equipamentSchema";
import equipmentTypeSchema from "../models/equipmentTypeSchema";
import Blob from 'blob';

dotenv.config();

interface RequestFiles extends Request {
  files: any[] | any;
}
class EquipamentoController {
  public async getEquipamentos(req: RequestFiles, res: Response) {
    const { status, tipo } = req.query;
    const cidade = decodeURIComponent(req.query.cidade as string);

    if (status && status !== 'ativo' && status !== 'inativo') {
      return res.status(400).json({ error: 'Parâmetro "status" inválido.' });
    }

    try {
      await equipmentTypeSchema.findById(tipo);
    } catch (error) {
      if (error.name == "CastError") {
        return res.status(404).json({ error: 'ID do Tipo não encontrado.' });
      }
      return res.status(500).json({ error });
    }

    try {
      const equipamentos = await equipamentSchema.find();
      const itens = equipamentos
        .filter(equip => {
          const cidadeFilter = cidade !== 'undefined' ? cidade == equip.cidade : true;
          const statusFilter = Boolean(status) ? (status == 'ativo' ? equip.isActive : !equip.isActive) : true;
          const tipoFilter = Boolean(tipo) ? tipo == equip.tipo.id : true;

          return cidadeFilter && statusFilter && tipoFilter;
        })
        .map(equip => ({
          id: equip._id,
          tipo: equip.tipo,
          serial: equip.serial,
          status: equip.isActive ? 'ativo' : 'inativo',
          img: equip.imgs[0],
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
      const equipamento = await equipamentSchema.findById(id);
      return res.status(200).json({
        id: equipamento._id,
        tipo: equipamento.tipo,
        serial: equipamento.serial,
        cidade: equipamento.cidade,
        obs: equipamento.obs,
        status: equipamento.isActive ? 'ativo' : 'inativo',
        imgs: equipamento.imgs,
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
    const { tipo, serial, cidade, obs } = req.body;

    const isActive = true;

    // validação das informações recebidas
    if (!tipo) {
      return res.status(400).json({ error: 'campo "Tipo" não informado.' });
    }

    if (!serial) {
      return res.status(400).json({ error: 'campo "Serial" não informado.' });
    }

    if (!cidade) {
      return res.status(400).json({ error: 'campo "Cidade" não informado.' });
    }

    if (!obs) {
      return res.status(400).json({ error: 'campo "Observação" não informado.' });
    }

    // validação se existe tipo (se não existir o tipo, deve retornar true para retornar o erro)
    try {
      const tipoObj = await equipmentTypeSchema.findById(tipo);
      console.log(tipoObj)
      const tipoId = tipoObj._id;

      // armazenamento das fotos do equipamento na api IMGUR
      if (!req.files) {
        return res.status(400).json({ error: 'Equipamento precisa ter no mínimo 1 foto.' });
      }
      const { images } = req.files;
      const imagens = Array.isArray(images) ? images : images ? [images] : [];

      if (!imagens.length) {
        return res.status(400).json({ error: 'Equipamento precisa ter no mínimo 1 foto.' });
      }
      const imgs = [];

      for (const img of imagens) {
        const imgName = `${uuidv4()}.jpg`;
        const imgBuffer = fs.readFileSync(img.path);
        const imgBlob = new Blob([imgBuffer], { type: 'image/jpeg' });

        const formData = new FormData();
        formData.append('image', imgBlob, imgName);

        try {
          const resp = await axios.post(
            'https://api.imgur.com/3/image',
            formData,
            { headers: { 'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}` } }
          );
          const url = resp.data.data.link;
          imgs.push(url);
        } catch (err) {
          console.log(err)
          return res.status(500).json({ error: err });
        }
      }

      try {
        const equipamento = await equipamentSchema.create({
          tipo: {
            id: tipoId,
            value: tipoObj.value
          },
          serial,
          cidade,
          obs,
          isActive,
          imgs
        });

        const id = equipamento._id;
        return res.status(200).json({ id });
      } catch (error) {
        console.log(error)
        res.status(500).json({
          error
        });
      }
    } catch (err) {
      if (err.name == "CastError") {
        return res.status(404).json({ error: 'ID do Tipo não encontrado.' });
      }
      console.log(err)
      return res.status(500).json({ err });
    }
  }

  public async update(req: RequestFiles, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID não informado.' });
    }

    try {
      const { tipo, serial, cidade, obs } = req.body;

      // validação das informações recebidas
      if (!tipo) {
        return res.status(400).json({ error: 'campo "Tipo" não informado.' });
      }

      if (!serial) {
        return res.status(400).json({ error: 'campo "Serial" não informado.' });
      }
      if (!cidade) {
        return res.status(400).json({ error: 'campo "Cidade" não informado.' });
      }
      if (!obs) {
        return res.status(400).json({ error: 'campo "Observação" não informado.' });
      }

      // validação se existe tipo (se não existir o tipo, deve retornar true para retornar o erro)
      try {
        const tipoObj = await equipmentTypeSchema.findById(tipo);

        // armazenamento das fotos do equipamento na api IMGUR
        const { images } = req.files;
        const imagens = Array.isArray(images) ? images : images ? [images] : [];

        if (!imagens.length) {
          return res.status(400).json({ error: 'Equipamento precisa ter no mínimo 1 foto.' });
        }
        const imgs = [];

        for (const img of imagens) {
          const imgName = `${uuidv4()}.jpg`;
          const imgBuffer = fs.readFileSync(img.path);
          const imgBlob = new Blob([imgBuffer], { type: 'image/jpeg' });

          const formData = new FormData();
          formData.append('image', imgBlob, imgName);

          try {
            const resp = await axios.post(
              'https://api.imgur.com/3/image',
              formData,
              { headers: { 'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}` } }
            );
            const url = resp.data.data.link;
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
      } catch (err) {
        // validar se ID existe, se não existir, deve retornar true na condição do if abaixo
        if (err.name == "CastError") {
          return res.status(404).json({ error: 'Equipamento não encontrado.' });
        }
        return res.status(500).json({ err });
      }
    } catch (error) {
      if (error.name == "CastError") {
        return res.status(404).json({ error: 'ID do Tipo não encontrado.' });
      }
      return res.status(500).json({ error });
    }
  }

  public async active(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID não informado.' });
    }

    try {
      const equip = await equipamentSchema.findById(id);

      // se equipamento já estiver ativo, condição do if abaixo deve ser true
      if (equip.isActive) {
        return res.status(409).json({ error: 'Equipamento já está ativo.' });
      }

      const isActive = false;
      const equipamento = await equipamentSchema.findByIdAndUpdate(id, { isActive });
      return res.status(200).json({ id: equipamento._id });
    } catch (err) {
      // validar se ID existe, se não existir, deve retornar true na condição do if abaixo
      if (err.name == "CastError") {
        return res.status(404).json({ error: 'Equipamento não encontrado.' });
      }
      return res.status(500).json({ err });
    }
  }

  public async desactive(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID não informado.' });
    }

    try {
      const equip = await equipamentSchema.findById(id);

      // se equipamento já estiver ativo, condição do if abaixo deve ser true
      if (!equip.isActive) {
        return res.status(409).json({ error: 'Equipamento já está inativo.' });
      }

      const isActive = false;
      const equipamento = await equipamentSchema.findByIdAndUpdate(id, { isActive });
      return res.status(200).json({ id: equipamento._id });
    } catch (err) {
      // validar se ID existe, se não existir, deve retornar true na condição do if abaixo
      if (err.name == "CastError") {
        return res.status(404).json({ error: 'Equipamento não encontrado.' });
      }
      return res.status(500).json({ err });
    }
  }
}

export default new EquipamentoController();