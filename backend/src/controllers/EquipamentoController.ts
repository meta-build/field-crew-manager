import axios from "axios";
import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

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
  }

  public async getEquipamentosById(req: Request, res: Response) {
    const { id } = req.query;

    // lógica para retornar equipamento por ID

    // se equipamento encontrado: status = 200; se equipamento NÃO encontrado: status = 404;
    const status = 200;
    const equipamento = {};

    return res.status(status).json(equipamento);
  }

  public async new(req: RequestFiles, res: Response) {
    // armazenamento das fotos do equipamento na api IMGUR
    const { imgs } = req.files;
    const imagens = Array.isArray(imgs) ? imgs : imgs ? [imgs] : [];
    // após processamento das imagens, armazenar url das imagens na informação do equipamento
    const imagensUrl = [];

    if (imagens.length) {
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
    }

    // informações básicas do equipamento
    const { teste } = req.body;
    // obs.: armazenar url das imagens no banco de dados referente ao equipamento que está sendo cadastrado, as urls estão armazenadas no array imagensUrl

    return res.status(200).json({ imgs: imagensUrl });
  }
}

export default new EquipamentoController();