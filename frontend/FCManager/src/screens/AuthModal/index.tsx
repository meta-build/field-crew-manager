import React, {useState} from 'react';
import {Image, Modal, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import colors from '../../styles/variables';

import useContexto from '../../hooks/useContexto';

import Btn from '../../components/Button';
import BottomModal from '../../components/BottomModal';
import InputText from '../../components/InputText';
import Title from '../../components/Title';

import Usuario from '../../services/Usuario';

import * as Keychain from 'react-native-keychain';

const logo = require('../../assets/images/loading-logo.png');

interface Props {
  visible: boolean;
  onClose: () => void;
}

function AuthModal(props: Props) {
  const nav = useNavigation();

  const {usuario, setUsuario} = useContexto();

  const [password, setPassword] = useState('');

  const [modal, setModal] = useState(false);
  const [failPassword, setFailPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitPassword = async () => {
    setLoading(true);
    try {
      const credentials: any = await Keychain.getGenericPassword();
      if (credentials.password === password) {
        passUser();
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

  const passUser = () => {
    setModal(false);
    setPassword('');
    props.onClose();
  };

  const exitUser = () => {
    Usuario.exit();
    setUsuario(undefined);
    setModal(false);
    setPassword('');
    nav.navigate('Home' as never);
    props.onClose();
  };

  return (
    <>
      <Modal visible={props.visible} onRequestClose={() => {}}>
        <View style={styles.view}>
          <SafeAreaView style={styles.container}>
            <Image source={logo} style={styles.logo} />
          </SafeAreaView>
          {usuario?.nome ? (
            <Btn
              styleType="blank"
              title="Entrar"
              onPress={() => setModal(true)}
            />
          ) : (
            <></>
          )}
        </View>
      </Modal>
      <BottomModal visible={modal} onPressOutside={() => setModal(false)}>
        <Title
          text="Seja bem-vindo(a) de volta,"
          color={'green'}
          align={'left'}
        />
        <Title text={usuario?.nome as string} color={'green'} align={'left'} />

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

export default AuthModal;
