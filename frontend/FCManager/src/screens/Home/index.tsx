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
import Usuario from '../../services/Usuario';

import useContexto from '../../hooks/useContexto';
import {UsuarioContext} from '../../contexts/Contexto';
import Link from '../../components/Link';

const logo = require('../../assets/images/logo-1.png');
const image = require('../../assets/images/home-image.png');

const {width, height} = Dimensions.get('window');

const Home = ({navigation}: any) => {
  const {setUsuario, setTempMail} = useContexto();

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

  const submitEmail = async () => {
    if (email) {
      // antes da requisição
      setLoading(true);

      const retorno = await Usuario.loginEmail(email);
      if ('nome' in retorno) {
        // se encontrar email
        setLoading(false);
        setName(retorno.nome);
        openLoginPasswordModal();
      } else if ('errorNum' in retorno) {
        if (retorno.errorNum === 404) {
          // se não encontrar email
          setLoading(false);
          setFailEmail(true);
        } else {
          // um erro diferente aconteceu
          setLoading(false);
          console.log(retorno);
        }
      } else {
        // Algo inesperado aconteceu
        console.error('Resposta inesperada da API');
        console.log(retorno);
      }
    }
  };

  const openLoginPasswordModal = () => {
    setloginPasswordModal(true);
    setLoginMailModal(false);
  };

  const submitPassword = async () => {
    if (password) {
      // antes da requisição
      setLoading(true);

      const retorno = await Usuario.login(email, password);
      if ('nome' in retorno) {
        // se senha correta
        setUsuario(retorno as UsuarioContext);

        setLoading(false);
        closeLoginModals();
        if (false) {
          goToWelcome();
        } else {
          goToList();
        }
      } else if ('errorNum' in retorno) {
        if (retorno.errorNum === 401) {
          //  se senha incorreta
          setLoading(false);
          setFailPassword(true);
        } else {
          // um erro diferente aconteceu
          setLoading(false);
          console.log(retorno);
        }
      } else {
        setLoading(false);
        // Algo inesperado aconteceu
        console.error('Resposta inesperada da API');
        console.log(retorno);
      }
    }
  };

  function goToList(): void {
    navigation.navigate('ToolList');
  }

  function goToWelcome() {
    navigation.navigate('Welcome');
  }

  function goToForgotPswd() {
    setTempMail(email);
    setEmail('');
    setPassword('');
    setloginPasswordModal(false);
    setLoginMailModal(false);
    navigation.navigate('SendMail');
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
            error={failEmail}
            value={email}
            onChange={e => setEmail(e.nativeEvent.text)}
            keyboardType="email-address"
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
    marginVertical: 18,
  },
  modalText: {
    marginBottom: 8,
    marginTop: 35,
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
