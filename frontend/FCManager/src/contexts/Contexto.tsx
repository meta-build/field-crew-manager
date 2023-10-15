import React, {createContext, useState} from 'react';
import {Usuario as UsuarioType} from '../types';

interface ContextProps {
  usuario: UsuarioType | undefined;
  setUsuario: React.Dispatch<React.SetStateAction<UsuarioType | undefined>>;
}

const Contexto = createContext({} as ContextProps);

function ContextoProvider({children}: any) {
  const [usuario, setUsuario] = useState<UsuarioType>();

  // fazer requisição get aqui!!! não fazer nos outros componentes, use useEffect!!!!
  return (
    <Contexto.Provider value={{usuario, setUsuario}}>
      {children}
    </Contexto.Provider>
  );
}

export {ContextoProvider, Contexto};
