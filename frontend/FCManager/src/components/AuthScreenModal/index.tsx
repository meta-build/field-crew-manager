import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '../../styles/variables';
import BottomModal from '../BottomModal';
import Btn from '../Button';
import InputText from '../InputText';
import Title from '../Title';
import useContexto from '../../hooks/useContexto';

import * as Keychain from 'react-native-keychain';
import Usuario from '../../services/Usuario';

const logo = require('../../assets/images/loading-logo.png');

const {width, height} = Dimensions.get('screen');

interface Props {
  visible: boolean;
  onClose: () => void;
}

function AuthScreenModal({visible, onClose}: Props) {
  const {usuario} = useContexto();

  const [password, setPassword] = useState('');

  const [modal, setModal] = useState(false);
  const [failPassword, setFailPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitPassword = async () => {
    setLoading(true);
    try {
      const credentials: any = await Keychain.getGenericPassword();
      if (credentials.password === password) {
        setLoading(false);
        setModal(false);
        onClose();
      } else {
        setFailPassword(true);
      }
    } catch (error) {
      console.log(error);
      setFailPassword(true);
    }
  };

  const exitUser = () => {
    Usuario.exit();
    setModal(false);
    onClose();
  };

  useEffect(() => {
    if (visible) {
      setModal(true);
    }
  }, [visible]);

  return (
    <>
      <Modal visible={visible} onRequestClose={() => {}}>
        <View style={styles.view}>
          <SafeAreaView style={styles.container}>
            <Image source={logo} style={styles.logo} />
          </SafeAreaView>
        </View>
      </Modal>
      <BottomModal visible={modal} onPressOutside={() => {}}>
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

export default AuthScreenModal;
