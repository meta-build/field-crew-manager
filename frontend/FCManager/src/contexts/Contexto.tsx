import React, {createContext, useEffect, useState} from 'react';
import {EquipamentoItemOff, Usuario as UsuarioType} from '../types';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Equipamento from '../services/Equipamento';

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

  const [updatingEquipmentQueue, setUpdatingEquipmentQueue] = useState(false);

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
        },
      }}>
      {children}
    </Contexto.Provider>
  );
}

export {ContextoProvider, Contexto};
export type {UsuarioContext};
