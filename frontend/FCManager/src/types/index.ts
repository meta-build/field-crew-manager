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
  latitude: number;
  longitude: number;
}

interface EquipamentoItemOff {
  tipo: string;
  tipoValue: string;
  serial: string;
  imgs: string[];
  latitude: number;
  longitude: number;
  obs: string;
}

interface Equipamento {
  id: string;
  tipo: Tipo;
  serial: string;
  cidade: string;
  obs: string;
  status: 'ativo' | 'inativo';
  imgs: string[];
  manobras: ManobraItem[];
  latitude: number;
  longitude: number;
}

interface Usuario {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  matricula: string;
  cpf: string;
  foto: string;
  isAdmin: boolean;
  isNew?: boolean;
}

interface UsuarioItem {
  id: string;
  nome: string;
  sobrenome: string;
  foto: string;
  matricula: string;
}

interface Manobra {
  titulo: string;
  descricao: string;
  datetimeInicio: string;
  datetimeFim?: string;
  equipamentos: {
    id: string;
    tipo: string;
    img: string;
    serial: string;
  }[];
  usuario: {
    id: string;
    nome: string;
    sobrenome: string;
  };
  latitude: number;
  longitude: number;
}

interface ManobraItem {
  id: string;
  titulo: string;
  datetimeFim?: string;
  usuario: {
    id: string;
    nome: string;
    sobrenome: string;
  };
  latitude: number;
  longitude: number;
}

interface ManobraItemOff {
  id?: string;
  titulo: string;
  descricao: string;
  equipamentos: string[];
  datetimeInicio: string;
  latitude: number;
  longitude: number;
  datetimeFim?: string;
  index?: number;
}

interface ErrorType {
  errorNum: number;
  errorMsg: string;
}

interface BufferType {
  latitude: number;
  longitude: number;
  distance: number;
}

interface AdmConfig {
  maxActiveManeuvers: number;
  defaultManeuverFilter: {
    maxDistance: {
      active: boolean;
      maxDistance: number;
    };
    maneuverStatus: {
      value: 'todos' | 'ativo' | 'concluido';
    };
  };
  defaultEquipmentFilter: {
    maxDistance: {
      active: boolean;
      maxDistance: number;
    };
    equipmentStatus: {
      value: 'todos' | 'ativo' | 'inativo';
    };
  };
}
export type {
  Tipo,
  Equipamento,
  EquipamentoItem,
  EquipamentoItemOff,
  Usuario,
  UsuarioItem,
  Manobra,
  ManobraItem,
  ManobraItemOff,
  ErrorType,
  BufferType,
  AdmConfig,
};
