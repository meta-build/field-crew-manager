import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../styles/variables';

import api from '../../services/api';
import useContexto from '../../hooks/useContexto';

import {UsuarioContext} from '../../contexts/Contexto';
import Btn from '../../components/Button';
import BottomModal from '../../components/BottomModal';
import InputText from '../../components/InputText';
import Title from '../../components/Title';

import Usuario from '../../services/Usuario';

import * as Keychain from 'react-native-keychain';
import {EquipamentoItemOff} from '../../types';

const logo = require('../../assets/images/loading-logo.png');

function Loading({navigation}: any) {
  const {setUsuario, queue} = useContexto();

  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');

  const [token, setToken] = useState('');
  const [user, setUser] = useState('');

  const [modal, setModal] = useState(false);
  const [failPassword, setFailPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    const tokenStorage = await AsyncStorage.getItem('token');
    const userStorage = await AsyncStorage.getItem('usuario');

    const equipmentQueueStorageJSON = await AsyncStorage.getItem(
      'createEquipmentQueue',
    );

    if (equipmentQueueStorageJSON) {
      const equipmentQueueStorage = JSON.parse(equipmentQueueStorageJSON);
      queue.equipments.setEquipments(
        equipmentQueueStorage as EquipamentoItemOff[],
      );
    }

    if (!tokenStorage || !userStorage) {
      navigation.navigate('Home');
    } else {
      setToken(tokenStorage);
      setUser(userStorage);
      const usuario = await JSON.parse(userStorage);
      setNome(usuario.nome);
      setModal(true);
    }
  };

  const submitPassword = async () => {
    setLoading(true);
    try {
      const credentials: any = await Keychain.getGenericPassword();
      if (credentials.password === password) {
        await passUser();
        setLoading(false);
        setModal(false);
      } else {
        setLoading(false);
        setFailPassword(true);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setFailPassword(true);
    }
  };

  const passUser = async () => {
    api.setToken(token);
    setUsuario(JSON.parse(user) as UsuarioContext);

    navigation.navigate('ToolList');
  };

  const exitUser = () => {
    Usuario.exit();
    setModal(false);
    navigation.navigate('Home');
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <View style={styles.view}>
        <SafeAreaView style={styles.container}>
          <Image source={logo} style={styles.logo} />
        </SafeAreaView>
        {nome ? (
          <Btn
            styleType="blank"
            title="Entrar"
            onPress={() => setModal(true)}
          />
        ) : (
          <></>
        )}
      </View>
      <BottomModal visible={modal} onPressOutside={() => setModal(false)}>
        <Title
          text="Seja bem-vindo(a) de volta,"
          color={'green'}
          align={'left'}
        />
        <Title text={nome} color={'green'} align={'left'} />

        <View style={styles.loginView}>
          {failPassword ? (
            <Text style={styles.modalError}>Senha incorreta.</Text>
          ) : (
            <></>
          )}
          <Text style={styles.modalLabel}>Senha:</Text>

          <InputText
            color={'gray'}
            isPassword
            style={styles.inputText}
            error={failPassword}
            placeholder="Senha"
            onChange={e => setPassword(e.nativeEvent.text)}
          />
        </View>

        <View style={styles.btnContainer}>
          <Btn
            onPress={() => submitPassword()}
            styleType="outlined"
            title="Entrar"
            loading={loading}
          />
          <Btn onPress={() => exitUser()} styleType="alert" title="Sair" />
        </View>
      </BottomModal>
    </>
  );
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: colors.green_1,
    // width,
    // height,
    flex: 1,
    padding: 18,
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logo: {
    width: '100%',
    height: 140,
    resizeMode: 'contain',
  },
  loginView: {
    marginTop: 18,
  },
  modalError: {
    color: colors.alert_1,
    marginVertical: 8,
  },
  modalLabel: {
    color: colors.dark_gray,
    marginBottom: 6,
  },
  inputText: {
    marginBottom: 24,
  },
  btnContainer: {
    width: '100%',
    gap: 12,
  },
});

export default Loading;
