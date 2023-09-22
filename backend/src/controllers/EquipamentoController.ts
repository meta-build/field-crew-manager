import axios from "axios";
import { Request, Response } from "express";
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import equipamentSchema from "../models/index"

dotenv.config();

interface RequestFiles extends Request {
  files: any[] | any;
}
class EquipamentoController {
  public async getEquipamentos(req: Request, res: Response) {
    const { status, page = '1' } = req.query;
    const tipo = decodeURIComponent(req.query.tipo as string);
    const cidade = decodeURIComponent(req.query.cidade as string);

    if (isNaN(Number(page))) {
      return res.status(400).json({ error: 'Parâmetro "page" inválido.' });
    }

    if (status && status !== 'ativo' && status !== 'inativo') {
      return res.status(400).json({ error: 'Parâmetro "status" inválido.' });
    }

    // lógica para retornar itens; filtrar por status, tipo e cidade. Pegar 15 equipamentos no máximo e seguir paginação (recebida pelo valor "page")
    // preencher array abaixo
    const itens = [];

    const backPage = Number(page) == 1 ? undefined : (Number(page) - 1);
    // se quant. itens <= 15 após paginação, nextPage = undefined
    const nextPage = 1;

    const templateEndpoint = `/equipamentos?status=${status || ''}&tipo=${tipo !== 'undefined' ? encodeURIComponent(tipo) : ''}&cidade=${cidade !== 'undefined' ? encodeURIComponent(cidade) : ''}&page=`;

    res.status(200).json({
      values: itens,
      metadata: {
        itens: itens.length,
        backPageEndpoint: backPage ? templateEndpoint + backPage : undefined,
        nextPageEndpoint: nextPage ? templateEndpoint + nextPage : undefined
      }
    });

    try {
      const equipamento = await equipamentSchema.find();
      return res.json(equipamento);
    } catch (error) {
      return res.status(400).json({
        error: "Something wrong happned, try again",
        message: error
      });
    }
  }

  public async getEquipamentosById(req: Request, res: Response) {
    try {
      const equipaments = await equipamentSchema.findById(req.params.id);
      return res.json(equipaments);
    } catch (error) {
      return res.status(400).json({
        error: "Something wrong happned, try again",
        message: error
      });
    }
  }

  public async new(req: RequestFiles, res: Response) {
    // informações básicas do equipamento
    const { tipo, serial, cidade, obs } = req.body;

    // validação das informações recebidas
    if (!tipo) {
      return res.status(400).json({ error: 'campo "Tipo" não informado.' });
    }
    if (isNaN(Number(tipo))) {
      return res.status(400).json({ error: '"Tipo" informado inválido.' });
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
    if (false) {
      return res.status(404).json({ error: 'ID do Tipo não encontrado.' });
    }

    // armazenamento das fotos do equipamento na api IMGUR
    if (!req.files) {
      return res.status(400).json({ error: 'Equipamento precisa ter no mínimo 1 foto.' });
    }
    const { imgs } = req.files;
    const imagens = Array.isArray(imgs) ? imgs : imgs ? [imgs] : [];

    if (!imagens.length) {
      return res.status(400).json({ error: 'Equipamento precisa ter no mínimo 1 foto.' });
    }
    const imagensUrl = [];

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
        imagensUrl.push(url);
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    }

    // obs.: armazenar url das imagens no banco de dados referente ao equipamento que está sendo cadastrado, as urls estão armazenadas no array imagensUrl
    // processo para inserção dos dados no campo de dados
    
    try {
      const equipamento = equipamentSchema.create({
        tipo, serial, cidade, obs
      });

      return res.json(equipamento);
    } catch (error) {
      return res.status(400).send({
        error: "Registration failed",
        message: error
      })
    }
    
    
    // pegar id do equipamento recém criado e armazenar na variável abaixo
    const id = 'asqda';

    return res.status(200).json({ id });
  }
  
  public async update(req: RequestFiles, res: Response) {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'ID não informado.' });
    }
    
    // validar se ID existe, se não existir, deve retornar true na condição do if abaixo
    if (false) {
      return res.status(404).json({ error: 'Equipamento não encontrado.' });
    }

    // informações básicas do equipamento
    const { tipo, serial, cidade, obs } = req.body;
  
    // validação das informações recebidas
    if (!tipo) {
      return res.status(400).json({ error: 'campo "Tipo" não informado.' });
    }
    if (isNaN(Number(tipo))) {
      return res.status(400).json({ error: '"Tipo" informado inválido.' });
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
    if (false) {
      return res.status(404).json({ error: 'ID do Tipo não encontrado.' });
    }
  
    // armazenamento das fotos do equipamento na api IMGUR
    const { imgs } = req.files;
    const imagens = Array.isArray(imgs) ? imgs : imgs ? [imgs] : [];
  
    if (!imagens.length) {
      return res.status(400).json({ error: 'Equipamento precisa ter no mínimo 1 foto.' });
    }
    const imagensUrl = [];
  
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
        imagensUrl.push(url);
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    }
  
    // obs.: armazenar url das imagens no banco de dados referente ao equipamento que está sendo cadastrado, as urls estão armazenadas no array imagensUrl
    // processo para edição dos dados no campo de dados



    return res.status(200).json({ id });
  }

  public async active (req: Request, res: Response) {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'ID não informado.' });
    }
    
    // validar se ID existe, se não existir, deve retornar true na condição do if abaixo
    if (false) {
      return res.status(404).json({ error: 'Equipamento não encontrado.' });
    }

    // se equipamento já estiver ativo, condição do if abaixo deve ser true
    if (false) {
      return res.status(409).json({ error: 'Equipamento já está ativo.' });
    }

    // processo para ativar equipamento


    return res.status(200).json({});
  }

  public async deactive (req: Request, res: Response) {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'ID não informado.' });
    }
    
    // validar se ID existe, se não existir, deve retornar true na condição do if abaixo
    if (false) {
      return res.status(404).json({ error: 'Equipamento não encontrado.' });
    }

    // se equipamento já estiver inativo, condição do if abaixo deve ser true
    if (false) {
      return res.status(409).json({ error: 'Equipamento já está inativo.' });
    }

    // processo para desativar equipamento


    return res.status(200).json({});
  }
}

export default new EquipamentoController();