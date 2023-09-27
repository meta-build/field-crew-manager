import {EquipamentoItem, Equipamento as EquipamentoType} from '../types';
import {apiJson} from './api';

interface EquipamentoListReturn {
  values: EquipamentoItem[];
  metadata: {
    itens: number;
  };
}

class Equipamento {
  async getAll(
    status: 'ativo' | 'inativo' | 'todos',
    tipo: string,
    cidade: string,
  ): Promise<EquipamentoListReturn> {
    const statusFilter = status === 'todos' ? '' : `status=${status}`;
    const tipoFilter = tipo ? `tipo=${tipo}` : '';
    const cidadeFilter = cidade ? `cidade=${encodeURIComponent(cidade)}` : '';

    const query = [statusFilter, tipoFilter, cidadeFilter]
      .filter(param => param !== '')
      .join('&');

    const {data} = await apiJson.get(`/equipamentos?${query}`);
    return data;
  }

  async getById(id: string): Promise<EquipamentoType> {
    const {data} = await apiJson.get(`/equipamentos/${id}`);
    return data;
  }
}

export default new Equipamento();
