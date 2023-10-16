import React from 'react';

import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import colors from '../../styles/variables';

import Home from '../Home';
import ToolList from '../ToolList';
import ToolProfile from '../ToolProfile';
import NewTool from '../NewTool';
import UserList from '../UserList';
import UserProfile from '../UserProfile';
import UserForm from '../UserForm';
import OwnUserProfile from '../OwnUserProfile';
import UpdateUserData from '../UpdateUserData';
import ChangePassword from '../ChangePassword';
import ManeuverList from '../ManeuverList';
import ManeuverProfile from '../ManeuverProfile';
import ManeuverForm from '../ManeuverForm';
import Loading from '../Loading';

const Stack = createNativeStackNavigator();

const ScreensContainer = () => {
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
            <Stack.Screen name="Loading" component={Loading} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="ToolList" component={ToolList} />
            <Stack.Screen name="ToolProfile" component={ToolProfile} />
            <Stack.Screen name="NewTool" component={NewTool} />
            <Stack.Screen name="UserList" component={UserList} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="UserForm" component={UserForm} />
            <Stack.Screen name="OwnUserProfile" component={OwnUserProfile} />
            <Stack.Screen name="UpdateUserData" component={UpdateUserData} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="ManeuverList" component={ManeuverList} />
            <Stack.Screen name="ManeuverProfile" component={ManeuverProfile} />
            <Stack.Screen name="ManeuverForm" component={ManeuverForm} />
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

export default ScreensContainer;
