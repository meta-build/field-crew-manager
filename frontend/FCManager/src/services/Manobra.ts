import {ManobraItem, Manobra as ManobraType} from '../types';
import api from './api';

interface ManobraListReturn {
  values: ManobraItem[];
  metadata: {
    itens: number;
  };
}

interface ManobraForm {
  titulo: string;
  descricao: string;
  equipamentos: string[];
  datetimeInicio: string;
}

class Manobra {
  async getAll(): Promise<ManobraListReturn> {
    const {data} = await api.apiJson.get('/manobras');
    return data;
  }

  async getById(id: string): Promise<ManobraType> {
    const {data} = await api.apiJson.get(`/manobras/${id}`);
    return data;
  }

  async new(manobra: ManobraForm): Promise<{id: string}> {
    const {data} = await api.apiJson.post('/manobras', manobra);
    return data;
  }
}

export default new Manobra();
