import {AdmConfig} from '../types';
import api from './api';

class Admin {
  async get(): Promise<AdmConfig> {
    const {data} = await api.apiJson.get('/admin');
    return data;
  }

  async apply(config: AdmConfig) {
    await api.apiJson.put('/admin', config);
  }
}

export default new Admin();
