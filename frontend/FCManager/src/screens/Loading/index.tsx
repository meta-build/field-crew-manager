import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../../styles/variables';

import api from '../../services/api';
import useContexto from '../../hooks/useContexto';
import {EquipamentoItemOff, ManobraItemOff} from '../../types';

import {UsuarioContext} from '../../contexts/Contexto';
import Btn from '../../components/Button';
import BottomModal from '../../components/BottomModal';
import InputText from '../../components/InputText';
import Title from '../../components/Title';

import Usuario from '../../services/Usuario';

import * as Keychain from 'react-native-keychain';
import Link from '../../components/Link';

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

  const loadQueues = async () => {
    const equipmentQueueStorageJSON = await AsyncStorage.getItem(
      'createEquipmentQueue',
    );

    if (equipmentQueueStorageJSON) {
      const equipmentQueueStorage = JSON.parse(equipmentQueueStorageJSON);
      queue.equipments.setEquipments(
        equipmentQueueStorage as EquipamentoItemOff[],
      );
    }

    const newManeuverQueueStorageJSON = await AsyncStorage.getItem(
      'createManeuverQueue',
    );

    if (newManeuverQueueStorageJSON) {
      const newManeuverQueueStorage = JSON.parse(newManeuverQueueStorageJSON);
      queue.maneuvers.setManeuvers(newManeuverQueueStorage as ManobraItemOff[]);
    }

    const closedManeuverQueueStorageJSON = await AsyncStorage.getItem(
      'closedManeuverQueue',
    );

    if (closedManeuverQueueStorageJSON) {
      const closedManeuverQueueStorage = JSON.parse(
        closedManeuverQueueStorageJSON,
      );
      queue.closedManeuvers.setClosedManeuvers(
        closedManeuverQueueStorage as ManobraItemOff[],
      );
    }
  };

  const getData = async () => {
    const tokenStorage = await AsyncStorage.getItem('token');
    const userStorage = await AsyncStorage.getItem('usuario');

    await loadQueues();

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

  function goToForgotPswd() {
    Usuario.exit();
    setModal(false);
    navigation.push('Home');
    navigation.navigate('SendMail');
  }

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
            error={failPassword}
            placeholder="Senha"
            onChange={e => setPassword(e.nativeEvent.text)}
          />
          <Link onPress={() => goToForgotPswd()} text="Esqueci minha senha" />
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
  btnContainer: {
    width: '100%',
    gap: 12,
  },
});

export default Loading;
