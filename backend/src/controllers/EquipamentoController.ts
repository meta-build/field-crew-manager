import { Request, Response } from "express";

class EquipamentoController {
  public async getEquipamentos (req: Request, res: Response) {
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
  }

  public async getEquipamentosById (req: Request, res: Response) {
    const { id } = req.query;

    // lógica para retornar equipamento por ID

    // se equipamento encontrado: status = 200; se equipamento NÃO encontrado: status = 404;
    const status = 200;
    const equipamento = {};

    return res.status(status).json(equipamento);
  }
}

export default new EquipamentoController();