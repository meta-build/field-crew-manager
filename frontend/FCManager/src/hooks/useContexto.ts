import {useContext} from 'react';
import {Contexto} from '../contexts/Contexto';

function useContexto() {
  const context = useContext(Contexto);
  return context;
}

export default useContexto;
