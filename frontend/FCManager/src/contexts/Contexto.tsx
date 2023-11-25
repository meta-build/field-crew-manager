import React, {createContext, useEffect, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Equipamento from '../services/Equipamento';
import Manobra from '../services/Manobra';

import {
  EquipamentoItem,
  EquipamentoItemOff,
  ManobraItemOff,
  Usuario as UsuarioType,
} from '../types';

interface UsuarioContext extends UsuarioType {
  manobrasAtivas: number;
}

interface ContextProps {
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
    };
    maneuvers: {
      addManeuver: (maneuver: ManobraItemOff) => Promise<void>;
      setManeuvers: (maneuvers: ManobraItemOff[]) => Promise<void>;
      removeManeuver: (index: number) => Promise<void>;
      clearManeuvers: () => Promise<void>;
      queue: ManobraItemOff[];
      updatingQueue: boolean;
    };
  };
}

const Contexto = createContext({} as ContextProps);

function ContextoProvider({children}: any) {
  const [usuario, setUsuario] = useState<UsuarioContext>();

  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [conected, setConected] = useState(true);

  const [equipmentQueue, setEquipmentQueue] = useState<EquipamentoItemOff[]>(
    [],
  );

  const [maneuverQueue, setManeuverQueue] = useState<ManobraItemOff[]>([]);

  const [updatingEquipmentQueue, setUpdatingEquipmentQueue] = useState(false);

  const [updatingManeuverQueue, setUpdatingManeuverQueue] = useState(false);

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
    const maneuverQueueTemp = [...maneuverQueue, maneuver];
    setManeuverQueue(maneuverQueueTemp);
    await AsyncStorage.setItem(
      'createManeuverQueue',
      JSON.stringify(maneuverQueueTemp),
    );
  };

  const setManeuvers = async (maneuvers: ManobraItemOff[]) => {
    setManeuverQueue(maneuvers);
    await AsyncStorage.setItem(
      'createEquipmentQueue',
      JSON.stringify(maneuvers),
    );
  };

  const removeManeuver = async (index: number) => {
    const maneuverQueueTemp = [...maneuverQueue];
    maneuverQueueTemp.splice(index, 1);
    setManeuverQueue(maneuverQueueTemp);
    await AsyncStorage.setItem(
      'createEquipmentQueue',
      JSON.stringify(maneuverQueueTemp),
    );
  };

  const clearManeuvers = async () => {
    setEquipmentQueue([]);
    await AsyncStorage.setItem('createEquipmentQueue', JSON.stringify([]));
  };

  const updateManeuvers = async () => {
    setUpdatingManeuverQueue(true);
    for (let i = 0; i < maneuverQueue.length; i++) {
      if (!conected) {
        setUpdatingManeuverQueue(false);
        break;
      }
      const maneuver = maneuverQueue[i];
      try {
        await Manobra.new(maneuver);
        removeManeuver(i);
      } catch (e) {
        console.log(e);
        setUpdatingManeuverQueue(false);
        break;
      }
    }
    setUpdatingManeuverQueue(false);
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
    if (conected) {
      updateEquipments();
      updateManeuvers();
    }
  }, [conected]);

  // fazer requisição get aqui!!! não fazer nos outros componentes, use useEffect!!!!
  return (
    <Contexto.Provider
      value={{
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
          },
          maneuvers: {
            addManeuver,
            setManeuvers,
            removeManeuver,
            clearManeuvers,
            queue: maneuverQueue,
            updatingQueue: updatingManeuverQueue,
          },
        },
      }}>
      {children}
    </Contexto.Provider>
  );
}

export {ContextoProvider, Contexto};
export type {UsuarioContext};
