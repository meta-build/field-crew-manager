import React, {createContext, useEffect, useState} from 'react';
import {Usuario as UsuarioType} from '../types';
import Geolocation from '@react-native-community/geolocation';

interface UsuarioContext extends UsuarioType {
  manobraAtiva: boolean;
}

interface ContextProps {
  usuario: UsuarioContext | undefined;
  setUsuario: React.Dispatch<React.SetStateAction<UsuarioContext | undefined>>;
  location: {
    latitude: number;
    longitude: number;
  };
}

const Contexto = createContext({} as ContextProps);

function ContextoProvider({children}: any) {
  const [usuario, setUsuario] = useState<UsuarioContext>();

  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

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

  // fazer requisição get aqui!!! não fazer nos outros componentes, use useEffect!!!!
  return (
    <Contexto.Provider value={{usuario, setUsuario, location}}>
      {children}
    </Contexto.Provider>
  );
}

export {ContextoProvider, Contexto};
export type {UsuarioContext};
