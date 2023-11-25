import React, {createContext, useEffect, useState} from 'react';
import {Usuario as UsuarioType} from '../types';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';

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
}

const Contexto = createContext({} as ContextProps);

function ContextoProvider({children}: any) {
  const [usuario, setUsuario] = useState<UsuarioContext>();

  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [conected, setConected] = useState(true);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log(position.coords);
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
    });

    return () => {
      // Não se esqueça de cancelar a inscrição ao desmontar
      unsubscribe();
    };
  }, []);

  // fazer requisição get aqui!!! não fazer nos outros componentes, use useEffect!!!!
  return (
    <Contexto.Provider value={{usuario, setUsuario, location, conected}}>
      {children}
    </Contexto.Provider>
  );
}

export {ContextoProvider, Contexto};
export type {UsuarioContext};
