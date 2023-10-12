import React, {useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {Usuario} from '../../types';
import colors from '../../styles/variables';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/Header/Index';
import ProfileImage from '../../components/ProfileImage';
import Navbar from '../../components/Navbar';
import Title from '../../components/Title';
import ExitBtn from '../../components/ExitBtn';
import OptionBtn from '../../components/OptionBtn';
import BottomModal from '../../components/BottomModal';
import Btn from '../../components/Button';

const {width, height} = Dimensions.get('window');

function OwnUserProfile({navigation, route}: any) {
  const [usuario, setUsuario] = useState<Usuario>({
    cpf: '123',
    email: '123',
    foto: '',
    id: '123',
    isAdmin: true,
    matricula: '123',
    nome: 'FULANO',
    sobrenome: '123',
    telefone: '12312',
  });

  const [exitModal, setExitModal] = useState(false);

  const openUpdateUser = () => {
    console.log('trocar dados');
  };

  const openChangePassword = () => {
    console.log('trocar senha');
  };

  const openExitModal = () => {
    setExitModal(true);
  };

  const exit = () => {
    console.log('sair');
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header text="Usuários" />
        <View style={styles.content}>
          <View style={styles.alignCenter}>
            <ProfileImage url={usuario?.foto as string} />
            <View style={styles.infoView}>
              <Title
                color="gray"
                text={`${usuario.nome} ${usuario.sobrenome}`}
              />
              {usuario?.isAdmin ? (
                <Text style={styles.adminLabel}>Administrador(a)</Text>
              ) : (
                <></>
              )}
            </View>
          </View>
          <View>
            <OptionBtn
              label="Editar meus dados"
              onPress={() => openUpdateUser()}
            />
            <OptionBtn
              label="Trocar senha"
              onPress={() => openChangePassword()}
            />
          </View>
          <View style={styles.space} />
          <View>
            <ExitBtn onPress={() => openExitModal()} />
          </View>
        </View>

        <Navbar navigation={navigation} selected="Perfil" />
      </SafeAreaView>
      <BottomModal
        onPressOutside={() => setExitModal(false)}
        visible={exitModal}>
        <View style={styles.exitModal}>
          <Title color="green" text="Deseja realmente sair?" align="center" />
          <View style={styles.exitBtnView}>
            <Btn styleType="alert" title="Sair" onPress={() => exit()} />
            <Btn
              styleType="outlined"
              title="Cancelar"
              onPress={() => setExitModal(false)}
            />
          </View>
        </View>
      </BottomModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white_2,
    height,
    width,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    paddingVertical: 16,
    gap: 18,
  },
  alignCenter: {
    alignItems: 'center',
    gap: 18,
  },
  adminLabel: {
    color: colors.green_2,
    fontSize: 16,
    fontWeight: 'bold',
  },
  panel: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 12,
    gap: 14,
  },
  space: {
    flex: 1,
  },
  btnView: {
    flexDirection: 'row',
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoView: {
    alignItems: 'center',
  },
  exitModal: {
    gap: 48,
  },
  exitBtnView: {
    gap: 14,
  },
});

export default OwnUserProfile;
