interface Tipo {
  id: string;
  value: string;
}

interface EquipamentoItem {
  id: string;
  tipo: Tipo;
  serial: string;
  status: 'ativo' | 'inativo';
  img: string;
}

interface Equipamento {
  id: string;
  tipo: Tipo;
  serial: string;
  cidade: string;
  obs: string;
  status: 'ativo' | 'inativo';
  imgs: string[];
}

export type {Tipo, Equipamento, EquipamentoItem};
