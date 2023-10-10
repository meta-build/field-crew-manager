import React from 'react';

import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './screens/Home';
import ToolList from './screens/ToolList';
import ToolProfile from './screens/ToolProfile';
import NewTool from './screens/NewTool';

import colors from './styles/variables';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <>
      <StatusBar backgroundColor={colors.white} />
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              header: () => null,
              navigationBarColor: colors.white,
            }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ToolList" component={ToolList} />
            <Stack.Screen name="ToolProfile" component={ToolProfile} />
            <Stack.Screen name="NewTool" component={NewTool} />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
