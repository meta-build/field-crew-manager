import React, {useEffect} from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../styles/variables';

import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../services/api';
import useContexto from '../../hooks/useContexto';
import {UsuarioContext} from '../../contexts/Contexto';

const {width, height} = Dimensions.get('screen');

const logo = require('../../assets/images/loading-logo.png');

function Loading({navigation}: any) {
  const {setUsuario} = useContexto();

  const getData = async () => {
    const token = await AsyncStorage.getItem('token');
    const user = await AsyncStorage.getItem('usuario');

    if (!token || !user) {
      navigation.navigate('Home');
    } else {
      api.setToken(token);
      setUsuario(JSON.parse(user) as UsuarioContext);

      navigation.navigate('ToolList');
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={styles.view}>
      <SafeAreaView style={styles.container}>
        <Image source={logo} style={styles.logo} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: colors.green_1,
    width,
    height,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: 140,
    resizeMode: 'contain',
  },
});

export default Loading;
