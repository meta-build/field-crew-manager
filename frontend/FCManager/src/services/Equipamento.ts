import {
  BufferType,
  EquipamentoItem,
  Equipamento as EquipamentoType,
} from '../types';
import api from './api';

interface EquipamentoListReturn {
  values: EquipamentoItem[];
  metadata: {
    itens: number;
  };
}

interface EquipamentoForm {
  tipo: string;
  serial: string;
  obs: string;
  imgs: string[];
  latitude: number;
  longitude: number;
}

class Equipamento {
  async getAll(
    status: 'ativo' | 'inativo' | 'todos',
    tipo: string,
    buffer?: BufferType,
  ): Promise<EquipamentoListReturn> {
    const statusFilter = status === 'todos' ? '' : `status=${status}`;
    const tipoFilter = tipo ? `tipo=${tipo}` : '';
    const bufferFilter = buffer
      ? `latitude=${buffer.latitude}&longitude=${buffer.longitude}&dist=${buffer.distance}`
      : '';

    const query = [statusFilter, tipoFilter, bufferFilter]
      .filter(param => param !== '')
      .join('&');

    const {data} = await api.apiJson.get(`/equipamentos?${query}`);
    return data;
  }

  async getById(id: string): Promise<EquipamentoType> {
    const {data} = await api.apiJson.get(`/equipamentos/${id}`);
    return data;
  }

  async active(id: string): Promise<{id: string}> {
    const {data} = await api.apiFormdata.put(`/equipamentos/ativar/${id}`);
    return data;
  }

  async deactive(id: string): Promise<{id: string}> {
    const {data} = await api.apiFormdata.put(`/equipamentos/desativar/${id}`);
    return data;
  }

  async new(equipamento: EquipamentoForm): Promise<{id: string}> {
    const formData = new FormData();
    formData.append('tipo', equipamento.tipo);
    formData.append('serial', equipamento.serial);
    formData.append('latitude', equipamento.latitude);
    formData.append('longitude', equipamento.longitude);
    formData.append('obs', equipamento.obs);

    equipamento.imgs.forEach((img, index) => {
      const imgName = `img_${index + 1}.jpg`;
      formData.append('images', {
        uri: img,
        name: imgName,
        type: 'image/jpeg',
      });
    });

    const {data} = await api.apiFormdata.post('/equipamentos', formData);
    return data;
  }

  async update(
    equipamento: EquipamentoForm,
    id: string,
  ): Promise<{id: string}> {
    const formData = new FormData();
    formData.append('tipo', equipamento.tipo);
    formData.append('serial', equipamento.serial);
    formData.append('latitude', equipamento.latitude);
    formData.append('longitude', equipamento.longitude);
    formData.append('obs', equipamento.obs);

    equipamento.imgs.forEach((img, index) => {
      const imgName = `img_${index + 1}.jpg`;
      formData.append('images', {
        uri: img,
        name: imgName,
        type: 'image/jpeg',
      });
    });

    const {data} = await api.apiFormdata.put(`/equipamentos/${id}`, formData);
    return data;
  }
}

export default new Equipamento();
