import {ManobraItem} from '../types';
import api from './api';

interface ManobraListReturn {
  values: ManobraItem[];
  metadata: {
    itens: number;
  };
}

class Manobra {
  async getAll(): Promise<ManobraListReturn> {
    const {data} = await api.apiJson.get('/manobras');
    return data;
  }
}

export default new Manobra();
