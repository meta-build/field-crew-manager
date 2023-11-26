interface Config {
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

const obj: Config = {
  maxActiveManeuvers: 10,
  defaultManeuverFilter: {
    maxDistance: {
      active: false,
      maxDistance: 1,
    },
    maneuverStatus: {
      value: 'ativo',
    },
  },
  defaultEquipmentFilter: {
    maxDistance: {
      active: true,
      maxDistance: 1,
    },
    equipmentStatus: {
      value: 'todos',
    },
  },
};

class Admin {
  async get(): Promise<Config> {
    return obj;
  }

  async apply(config: Config) {
    console.log(config);
  }
}

export default new Admin();
