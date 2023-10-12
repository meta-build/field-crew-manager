import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import colors from '../../styles/variables';
import Btn from '../../components/Button';
import Title from '../../components/Title';
import BottomModal from '../../components/BottomModal';
import InputText from '../../components/InputText';

const logo = require('../../assets/images/logo-1.png');
const image = require('../../assets/images/home-image.png');

const {width, height} = Dimensions.get('window');

const Home = ({navigation}: any) => {
  const [loginMailModal, setLoginMailModal] = useState(false);
  const [loginPasswordModal, setloginPasswordModal] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');

  const [failEmail, setFailEmail] = useState(false);
  const [failPassword, setFailPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const openLoginMailModal = () => {
    setLoginMailModal(true);
  };

  const closeLoginModals = () => {
    setLoginMailModal(false);
    setloginPasswordModal(false);
    setEmail('');
    setPassword('');
    setFailEmail(false);
    setFailEmail(false);
  };

  const submitEmail = () => {
    if (email) {
      // antes da requisição
      setLoading(true);

      // se encontrar email
      setName('flano');
      openLoginPasswordModal();

      // se não encontrar email
      // setFailEmail(true);

      // depois da requisição
      setLoading(false);
    }
  };

  const openLoginPasswordModal = () => {
    setloginPasswordModal(true);
    setLoginMailModal(false);
  };

  const submitPassword = () => {
    if (password) {
      // antes da requisição
      setLoading(true);

      // se senha correta
      goToList();

      //  se senha incorreta
      setFailPassword(true);

      // depois da requisição
      setLoading(false);
    }
  };

  function goToList(): void {
    navigation.navigate('ToolList');
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Image style={styles.logo} source={logo} />
        <View style={styles.content}>
          <Image style={styles.image} source={image} />
          <Title
            align="center"
            color="green"
            text="Gerencie seus equipamentos em campo."
          />
          <Text style={styles.text}>
            O segredo para o sucesso em campo: simplifique o gerenciamento de
            seus equipamentos de forma fácil, intuitiva e eficiente.
          </Text>
        </View>
        <View style={styles.btnContainer}>
          <Btn
            onPress={() => openLoginMailModal()}
            styleType="filled"
            title="Iniciar"
          />
        </View>
      </SafeAreaView>

      {/* login email */}
      <BottomModal
        visible={loginMailModal}
        onPressOutside={() => closeLoginModals()}>
        <Title text="Seja bem vindo(a)" color={'green'} align={'left'} />

        <View style={styles.loginView}>
          {failEmail ? (
            <Text style={styles.modalError}>E-mail não encontrado.</Text>
          ) : (
            <></>
          )}
          <Text style={styles.modalLabel}>E-mail:</Text>
          <InputText
            color={'gray'}
            placeholder="exemplo@dominio.com"
            style={styles.inputText}
            error={failEmail}
            value={email}
            onChange={e => setEmail(e.nativeEvent.text)}
          />
        </View>

        <View style={styles.btnContainer}>
          <Btn
            onPress={() => submitEmail()}
            styleType="outlined"
            title="Continuar"
            loading={loading}
          />
        </View>
      </BottomModal>

      {/* login senha */}
      <BottomModal
        visible={loginPasswordModal}
        onPressOutside={() => closeLoginModals()}>
        <Title text="Seja bem-vindo(a)," color={'green'} align={'left'} />
        <Title text={name} color={'green'} align={'left'} />

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
        </View>
      </BottomModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: colors.white,
  },
  logo: {
    height: 22,
    width: 166.22,
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  image: {
    width: 286.59,
    height: 203,
    marginBottom: 12,
  },
  text: {
    color: colors.dark_gray,
    textAlign: 'center',
  },
  btnContainer: {
    width: '100%',
  },
  loginView: {
    marginTop: 18,
  },
  modalText: {
    marginBottom: 8,
    marginTop: 35,
  },
  inputText: {
    marginBottom: 24,
  },
  modalLabel: {
    color: colors.dark_gray,
    marginBottom: 6,
  },
  modalError: {
    color: colors.alert_1,
    marginVertical: 8,
  },
});

export default Home;
