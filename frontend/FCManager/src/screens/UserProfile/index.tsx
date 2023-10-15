import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Usuario as UsuarioType} from '../../types';
import colors from '../../styles/variables';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/Header/Index';
import ProfileImage from '../../components/ProfileImage';
import Info from '../../components/Info';
import Btn from '../../components/Button';
import Navbar from '../../components/Navbar';
import Usuario from '../../services/Usuario';

const {width, height} = Dimensions.get('window');

function Panel({children}: any) {
  return <View style={styles.panel}>{children}</View>;
}

function UserProfile({navigation, route}: any) {
  const {id} = route.params;

  const [usuario, setUsuario] = useState<UsuarioType>();

  const openFormUser = () => {
    navigation.navigate('UserForm', {id});
  };

  function maskPhoneNumber(phoneNumber: string) {
    // Remove todos os caracteres não numéricos do número de telefone
    const numericOnly = phoneNumber.replace(/\D/g, '');

    // Formate o número com a máscara desejada
    const formattedNumber = `+${numericOnly.slice(0, 2)} (${numericOnly.slice(
      2,
      4,
    )}) ${numericOnly.slice(4, 9)}-${numericOnly.slice(9, 13)}`;

    return formattedNumber;
  }

  function maskCPF(cpf: string) {
    // Remove todos os caracteres não numéricos do CPF
    const numericOnly = cpf.replace(/\D/g, '');
  
    // Formate o CPF com a máscara desejada
    const formattedCPF = `${numericOnly.slice(0, 3)}.${numericOnly.slice(3, 6)}.${numericOnly.slice(6, 9)}-${numericOnly.slice(9, 11)}`;
  
    return formattedCPF;
  }

  useEffect(() => {
    const onFocus = navigation.addListener('focus', async () => {
      const retorno = await Usuario.getById(id);
      setUsuario(retorno);
    });

    return onFocus;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header text="Usuários" />
        {usuario ? (
          <>
            <View style={styles.content}>
              <View style={styles.alignCenter}>
                <ProfileImage url={usuario?.foto as string} />
                {usuario?.isAdmin ? (
                  <Text style={styles.adminLabel}>Administrador(a)</Text>
                ) : (
                  <></>
                )}
              </View>
              <Panel>
                <Info
                  label="Nome/Sobrenome"
                  value={`${usuario?.nome} ${usuario?.sobrenome}`}
                />
                <Info label="Email" value={usuario?.email as string} />
                <Info
                  label="Telefone"
                  value={maskPhoneNumber(usuario?.telefone)}
                />
                <Info label="Matrícula" value={usuario?.matricula as string} />
                <Info label="CPF" value={maskCPF(usuario?.cpf)} />
              </Panel>
              <View style={styles.space} />
              <View>
                <Btn
                  styleType="filled"
                  title="Editar"
                  onPress={() => openFormUser()}
                />
              </View>
            </View>
          </>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={52} color={colors.green_1} />
          </View>
        )}
        <Navbar navigation={navigation} selected="Usuários" />
      </SafeAreaView>
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
    padding: 16,
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
});

export default UserProfile;
