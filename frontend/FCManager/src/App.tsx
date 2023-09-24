import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home';
import ToolList from './screens/ToolList';
import ToolProfile from './screens/ToolProfile';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          header: () => null,
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ToolList" component={ToolList} />
        <Stack.Screen name="ToolProfile" component={ToolProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
