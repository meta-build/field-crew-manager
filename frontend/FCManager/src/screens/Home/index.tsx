import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
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

const { width, height } = Dimensions.get('window');

const Home = ({ navigation }: any) => {
  const [loginModalL, setloginModal] = useState(false);
  const [loginPasswordModal, setloginPasswordModal] = useState(false);
  const [failEmail, setFailEmail] = useState(false);
  const [failPassword, setFailPassword] = useState(false);

  const openLoginModal = () => {
    setloginModal(true);
    setloginPasswordModal(false);
  };
  
  const closeLoginModal = () => {
    setloginModal(false);
  };

  const openLoginPasswordModal = () => {
     setloginPasswordModal(true);
     setloginModal(false);
  };

  const closeLoginPasswordModal = () => {
    setloginPasswordModal(false);
  }

  const submitEmail = () => {
     setFailEmail(true);
  }

  const submitPassword = () => {
    setFailPassword(true);
  }

  function goToList(): void {
    throw new Error('Function not implemented.');
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
            O segredo para o sucesso em campo: simplifique o gerenciamento de seus
            equipamentos de forma fácil, intuitiva e eficiente.
          </Text>
        </View>
        <View style={styles.btnContainer}>
          <Btn onPress={() => openLoginModal()} styleType="filled" title="Iniciar" />
        </View>
      </SafeAreaView>
      <BottomModal
        visible={loginModalL}
        onPressOutside={() =>
          closeLoginModal()}>
            
        <Title
         text='Seja bem vindo(a)'
         color={'green'}
         align={'left'}
        />
        

        {failEmail ? <Text> email invalido</Text> : <></>}
        <Text style={styles.modalText}>
          E-mail:
        </Text>

        <InputText
         color={'gray'}
         placeholder='exemplo@dominio.com'
         style={styles.inputText}
         error={failEmail}     
         />
          

        <View style={styles.btnContainer}> 
         <Btn 
          onPress={() => openLoginPasswordModal()}
          styleType="outlined"
          title='Continuar' />
        </View>

      </BottomModal>
      
      <BottomModal
             visible={loginPasswordModal}
             onPressOutside={() =>
              closeLoginPasswordModal()}>

          <Title
           text='Seja bem vindo(a)'
           color={'green'}
           align={'left'}
           />

          {failPassword ? <Text> senha invalida</Text> : <></>}
          <Text style={styles.modalText}>
            Senha:
          </Text>

          <InputText
           color={'gray'}
           isPassword style={styles.inputText}
           error={failPassword}
           > 
           </InputText>

        <View style={styles.btnContainer}> 
         <Btn 
          onPress={() => closeLoginPasswordModal()}
          styleType="outlined"
          title='Entrar' />
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
  modalText: {
    marginBottom: 8,
    marginTop: 35,
  },
  inputText: {
    marginBottom: 24,
  },
  
});

export default Home;
function setEmailError(arg0: boolean) {
  throw new Error('Function not implemented.');
}

function setPasswordError(arg0: boolean) {
  throw new Error('Function not implemented.');
}

