import React from 'react';

import {enableLatestRenderer} from 'react-native-maps';

import ScreensContainer from './screens/ScreensContainer';
import {ContextoProvider} from './contexts/Contexto';

enableLatestRenderer();

const App = () => {
  return (
    <>
      <ContextoProvider>
        <ScreensContainer />
      </ContextoProvider>
    </>
  );
};

export default App;
