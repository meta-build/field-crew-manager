import { Request, Response } from "express";

class TipoController {
  public async getTipos (req: Request, res: Response) {
    try {
      // lógica para retornar todos os tipos de equipamentos no bd
      // obs.: armazenar no array abaixo
      const tipos = [];



      return res.status(tipos.length ? 200 : 204).json(tipos);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }

  public async new (req: Request, res: Response) {
    console.log(req.body);
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Campo "value" não informado.' });
    }

    // lógica para inserir novo tipo de equipamento com a variável value


    // após inserção, pegar id recém criado e armazenar na variável abaixo
    const id = '123123';

    return res.status(201).json({ id });
  }
}

export default new TipoController();