import React, {createContext, useEffect, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Equipamento from '../services/Equipamento';
import Manobra from '../services/Manobra';

import {
  EquipamentoItemOff,
  ManobraItemOff,
  Usuario as UsuarioType,
} from '../types';

interface UsuarioContext extends UsuarioType {
  manobrasAtivas: number;
}

interface ContextProps {
  tempMail: string;
  setTempMail: React.Dispatch<React.SetStateAction<string>>;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  usuario: UsuarioContext | undefined;
  setUsuario: React.Dispatch<React.SetStateAction<UsuarioContext | undefined>>;
  location: {
    latitude: number;
    longitude: number;
  };
  conected: boolean;
  queue: {
    equipments: {
      addEquipment: (equipment: EquipamentoItemOff) => Promise<void>;
      setEquipments: (equipments: EquipamentoItemOff[]) => Promise<void>;
      removeEquipment: (index: number) => Promise<void>;
      clearEquipments: () => Promise<void>;
      queue: EquipamentoItemOff[];
      updatingQueue: boolean;
      getBannedEquipmentIDs: () => Promise<string[]>;
    };
    maneuvers: {
      addManeuver: (maneuver: ManobraItemOff) => Promise<void>;
      setManeuvers: (maneuvers: ManobraItemOff[]) => Promise<void>;
      removeManeuver: (index: number) => Promise<void>;
      clearManeuvers: () => Promise<void>;
      closeManeuver: (maneuver: ManobraItemOff) => Promise<void>;
      queue: ManobraItemOff[];
      updatingQueue: boolean;
    };
    closedManeuvers: {
      addClosedManeuver: (maneuver: ManobraItemOff) => Promise<void>;
      setClosedManeuvers: (maneuvers: ManobraItemOff[]) => Promise<void>;
      removeClosedManeuver: (index: number) => Promise<void>;
      clearClosedManeuvers: () => Promise<void>;
      queue: ManobraItemOff[];
      updatingQueue: boolean;
    };
  };
}

const Contexto = createContext({} as ContextProps);

function ContextoProvider({children}: any) {
  const [usuario, setUsuario] = useState<UsuarioContext>();
  const [tempMail, setTempMail] = useState('');
  const [code, setCode] = useState('');

  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [conected, setConected] = useState(true);

  const [equipmentQueue, setEquipmentQueue] = useState<EquipamentoItemOff[]>(
    [],
  );

  const [maneuverQueue, setManeuverQueue] = useState<ManobraItemOff[]>([]);

  const [closedManeuverQueue, setClosedManeuverQueue] = useState<
    ManobraItemOff[]
  >([]);

  const [updatingEquipmentQueue, setUpdatingEquipmentQueue] = useState(false);
  const [updatingManeuverQueue, setUpdatingManeuverQueue] = useState(false);
  const [updatingClosedManeuverQueue, setUpdatingClosedManeuverQueue] =
    useState(false);

  const addEquipment = async (equipment: EquipamentoItemOff) => {
    const equipmentQueueTemp = [...equipmentQueue, equipment];
    setEquipmentQueue(equipmentQueueTemp);
    await AsyncStorage.setItem(
      'createEquipmentQueue',
      JSON.stringify(equipmentQueueTemp),
    );
  };

  const setEquipments = async (equipments: EquipamentoItemOff[]) => {
    setEquipmentQueue(equipments);
    await AsyncStorage.setItem(
      'createEquipmentQueue',
      JSON.stringify(equipments),
    );
  };

  const removeEquipment = async (index: number) => {
    const equipmentQueueTemp = [...equipmentQueue];
    equipmentQueueTemp.splice(index, 1);
    setEquipmentQueue(equipmentQueueTemp);
    await AsyncStorage.setItem(
      'createEquipmentQueue',
      JSON.stringify(equipmentQueueTemp),
    );
  };

  const clearEquipments = async () => {
    setEquipmentQueue([]);
    await AsyncStorage.setItem('createEquipmentQueue', JSON.stringify([]));
  };

  const getBannedEquipmentIDs = async () => {
    const bannedEquipmentsJSON = await AsyncStorage.getItem('bannedEquipments');
    const bannedEquipments = bannedEquipmentsJSON
      ? JSON.parse(bannedEquipmentsJSON)
      : [];

    return bannedEquipments;
  };

  const updateEquipments = async () => {
    setUpdatingEquipmentQueue(true);
    for (let i = 0; i < equipmentQueue.length; i++) {
      if (!conected) {
        setUpdatingEquipmentQueue(false);
        break;
      }
      const equipment = equipmentQueue[i];
      try {
        await Equipamento.new({
          imgs: equipment.imgs,
          latitude: equipment.latitude,
          longitude: equipment.longitude,
          obs: equipment.obs,
          serial: equipment.serial,
          tipo: equipment.tipo,
        });
        removeEquipment(i);
      } catch (e) {
        console.log(e);
        setUpdatingEquipmentQueue(false);
        break;
      }
    }
    setUpdatingEquipmentQueue(false);
  };

  const addManeuver = async (maneuver: ManobraItemOff) => {
    const maneuverQueueTemp = [
      ...maneuverQueue,
      {...maneuver, index: maneuverQueue.length},
    ];
    setManeuverQueue(maneuverQueueTemp);
    await AsyncStorage.setItem(
      'createManeuverQueue',
      JSON.stringify(maneuverQueueTemp),
    );

    const bannedEquipmentsJSON = await AsyncStorage.getItem('bannedEquipments');
    const bannedEquipments = bannedEquipmentsJSON
      ? JSON.parse(bannedEquipmentsJSON)
      : [];
    bannedEquipments.push(...maneuver.equipamentos);
    await AsyncStorage.setItem(
      'bannedEquipments',
      JSON.stringify(bannedEquipments),
    );
  };

  const setManeuvers = async (maneuvers: ManobraItemOff[]) => {
    setManeuverQueue(maneuvers);
    await AsyncStorage.setItem(
      'createManeuverQueue',
      JSON.stringify(maneuvers),
    );
  };

  const removeManeuver = async (index: number) => {
    const maneuverQueueTemp = [...maneuverQueue];
    maneuverQueueTemp.splice(index, 1);
    setManeuverQueue(maneuverQueueTemp);
    await AsyncStorage.setItem(
      'createManeuverQueue',
      JSON.stringify(maneuverQueueTemp),
    );
  };

  const clearManeuvers = async () => {
    setManeuverQueue([]);
    await AsyncStorage.setItem('createManeuverQueue', JSON.stringify([]));
  };

  const closeManeuver = async (maneuver: ManobraItemOff) => {
    try {
      const datetimeFim = new Date().toISOString();
      const maneuverTemp = {...maneuver, datetimeFim};

      const maneuverQueueTemp = [...maneuverQueue];
      maneuverQueueTemp[maneuverTemp.index as number] = maneuverTemp;

      await setManeuvers(maneuverQueueTemp);

      const bannedEquipmentsJSON = await AsyncStorage.getItem(
        'bannedEquipments',
      );
      const bannedEquipments = JSON.parse(
        bannedEquipmentsJSON as string,
      ) as string[];
      bannedEquipments.filter(id => !maneuverTemp.equipamentos.includes(id));
      await AsyncStorage.setItem(
        'bannedEquipments',
        JSON.stringify(bannedEquipments),
      );
    } catch (e) {
      console.log(e);
    }
  };

  const updateManeuvers = async () => {
    setUpdatingManeuverQueue(true);
    for (let i = 0; i < maneuverQueue.length; i++) {
      if (!conected) {
        setUpdatingManeuverQueue(false);
        break;
      }
      const maneuver = {...maneuverQueue[i]};
      try {
        const res = await Manobra.new(maneuver);

        if (maneuver.datetimeFim) {
          console.log(maneuver, res.id);
          await Manobra.finalize(res.id);
          await removeManeuver(i);
        } else {
          await removeManeuver(i);
        }
      } catch (e) {
        console.log(e);
        setUpdatingManeuverQueue(false);
        break;
      }
    }
    setUpdatingManeuverQueue(false);
  };

  const addClosedManeuver = async (maneuver: ManobraItemOff) => {
    const closedManeuverQueueTemp = [...closedManeuverQueue, maneuver];
    setClosedManeuverQueue(closedManeuverQueueTemp);
    await AsyncStorage.setItem(
      'closedManeuverQueue',
      JSON.stringify(closedManeuverQueueTemp),
    );
  };

  const setClosedManeuvers = async (maneuvers: ManobraItemOff[]) => {
    setClosedManeuverQueue(maneuvers);
    await AsyncStorage.setItem(
      'closedManeuverQueue',
      JSON.stringify(maneuvers),
    );
  };

  const removeClosedManeuver = async (index: number) => {
    const closedManeuverQueueTemp = [...closedManeuverQueue];
    console.log(closedManeuverQueueTemp);
    closedManeuverQueueTemp.splice(index, 1);
    console.log(closedManeuverQueueTemp);
    setClosedManeuverQueue(closedManeuverQueueTemp);
    await AsyncStorage.setItem(
      'closedManeuverQueue',
      JSON.stringify(closedManeuverQueueTemp),
    );
  };

  const clearClosedManeuvers = async () => {
    setClosedManeuverQueue([]);
    await AsyncStorage.setItem('closedManeuverQueue', JSON.stringify([]));
  };

  const updateClosedManeuvers = async () => {
    setUpdatingClosedManeuverQueue(true);
    for (let i = 0; i < closedManeuverQueue.length; i++) {
      if (!conected) {
        setUpdatingClosedManeuverQueue(false);
        break;
      }
      const maneuver = closedManeuverQueue[i];
      try {
        if (maneuver.id) {
          await Manobra.finalize(maneuver.id);
          await removeClosedManeuver(i);
        }
      } catch (e) {
        console.log(e);
        setUpdatingClosedManeuverQueue(false);
        break;
      }
    }
    setUpdatingClosedManeuverQueue(false);
  };

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
      },
      error => {
        console.log('erro', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10,
      },
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConected(Boolean(state.isInternetReachable));
      console.log('conexão:', state.isInternetReachable);
    });

    return () => {
      // Não se esqueça de cancelar a inscrição ao desmontar
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const update = async () => {
      if (conected) {
        await updateEquipments();
        await updateManeuvers();
        await updateClosedManeuvers();
      }
    };

    update();
  }, [conected]);

  // fazer requisição get aqui!!! não fazer nos outros componentes, use useEffect!!!!
  return (
    <Contexto.Provider
      value={{
        tempMail,
        setTempMail,
        code,
        setCode,
        usuario,
        setUsuario,
        location,
        conected,
        queue: {
          equipments: {
            addEquipment,
            setEquipments,
            removeEquipment,
            clearEquipments,
            queue: equipmentQueue,
            updatingQueue: updatingEquipmentQueue,
            getBannedEquipmentIDs,
          },
          maneuvers: {
            addManeuver,
            setManeuvers,
            removeManeuver,
            clearManeuvers,
            queue: maneuverQueue,
            updatingQueue: updatingManeuverQueue,
            closeManeuver,
          },
          closedManeuvers: {
            addClosedManeuver,
            clearClosedManeuvers,
            queue: closedManeuverQueue,
            removeClosedManeuver,
            setClosedManeuvers,
            updatingQueue: updatingClosedManeuverQueue,
          },
        },
      }}>
      {children}
    </Contexto.Provider>
  );
}

export {ContextoProvider, Contexto};
export type {UsuarioContext};
