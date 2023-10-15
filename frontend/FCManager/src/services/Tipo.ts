import {Tipo as TipoType} from '../types/index';
import api from './api';

class Tipo {
  async getAll(): Promise<TipoType[]> {
    const {data} = await api.apiJson.get('/tipos');
    return data;
  }

  async new(value: string): Promise<{id: string}> {
    const {data} = await api.apiJson.post('/tipos', {value});
    return data;
  }
}

export default new Tipo();
