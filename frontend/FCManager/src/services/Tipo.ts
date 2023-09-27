import {Tipo as TipoType} from '../types/index';
import {apiJson} from './api';

class Tipo {
  async getAll(): Promise<TipoType[]> {
    const {data} = await apiJson.get('/tipos');
    return data;
  }

  async new(value: string): Promise<{id: string}> {
    const {data} = await apiJson.post('/tipos', {value});
    return data;
  }
}

export default new Tipo();
