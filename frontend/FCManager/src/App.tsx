import React from 'react';

import ScreensContainer from './screens/ScreensContainer';
import {ContextoProvider} from './contexts/Contexto';

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
