import React, {useEffect, useState} from 'react';

import {AppState, StatusBar, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import colors from '../../styles/variables';

import Home from '../Home';
import ToolList from '../ToolList';
import ToolProfile from '../ToolProfile';
import ToolForm from '../ToolForm';
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
import AuthModal from '../AuthModal';
import useContexto from '../../hooks/useContexto';
import Welcome from '../FstLogin/Welcome';
import ChangePhoto from '../FstLogin/ChangePhoto';
import FstPassword from '../FstLogin/FstPassword';
import WelcomeFinal from '../FstLogin/WelcomeFinal';
import SendMail from '../ForgotPassword/SendMail';
import InsertCode from '../ForgotPassword/InsertCode';
import UpdatePassword from '../ForgotPassword/UpdatePassword';
import ChangePasswordConfirmed from '../ForgotPassword/ChangePasswordConfirmed';
import AdmConfig from '../AdmConfig';

const Stack = createNativeStackNavigator();

const ScreensContainer = () => {
  const {usuario} = useContexto();

  const [modal, setModal] = useState(false);

  useEffect(() => {
    AppState.addEventListener('change', appState => {
      if (appState === 'background') {
        if (usuario) {
          setModal(true);
        } else {
          setModal(false);
        }
      }
    });
  }, [usuario]);

  return (
    <>
      <StatusBar backgroundColor={colors.white} />
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <AuthModal visible={modal} onClose={() => setModal(false)} />
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
            <Stack.Screen name="ToolForm" component={ToolForm} />
            <Stack.Screen name="UserList" component={UserList} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="UserForm" component={UserForm} />
            <Stack.Screen name="OwnUserProfile" component={OwnUserProfile} />
            <Stack.Screen name="AdmConfig" component={AdmConfig} />
            <Stack.Screen name="UpdateUserData" component={UpdateUserData} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="ManeuverList" component={ManeuverList} />
            <Stack.Screen name="ManeuverProfile" component={ManeuverProfile} />
            <Stack.Screen name="ManeuverForm" component={ManeuverForm} />

            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="ChangePhoto" component={ChangePhoto} />
            <Stack.Screen name="FstPassword" component={FstPassword} />
            <Stack.Screen name="WelcomeFinal" component={WelcomeFinal} />

            <Stack.Screen name="SendMail" component={SendMail} />
            <Stack.Screen name="InsertCode" component={InsertCode} />
            <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
            <Stack.Screen
              name="ChangePasswordConfirmed"
              component={ChangePasswordConfirmed}
            />
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
