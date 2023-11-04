import {BufferType, ManobraItem, Manobra as ManobraType} from '../types';
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
  latitude: number;
  longitude: number;
}

class Manobra {
  async getAll(buffer?: BufferType): Promise<ManobraListReturn> {
    const url = buffer
      ? `/manobras?latitude=${buffer.latitude}&longitude=${buffer.longitude}&dist=${buffer.distance}`
      : '/manobras';
    const {data} = await api.apiJson.get(url);
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

  async finalize(id: string): Promise<any> {
    try {
      const retorno = await api.apiJson.put(`/manobras/finalizar/${id}`);
      return retorno;
    } catch (err) {
      throw err;
    }
  }
}

export default new Manobra();
