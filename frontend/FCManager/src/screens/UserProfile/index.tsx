import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Usuario} from '../../types';
import colors from '../../styles/variables';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../components/Header/Index';
import ProfileImage from '../../components/ProfileImage';
import Info from '../../components/Info';
import Btn from '../../components/Button';
import Navbar from '../../components/Navbar';

const {width, height} = Dimensions.get('window');

function Panel({children}: any) {
  return <View style={styles.panel}>{children}</View>;
}

function UserProfile({navigation, route}: any) {
  const {id} = route.params;

  const [usuario, setUsuario] = useState<Usuario>();

  const openFormUser = () => {
    navigation.navigate('UserForm', {id});
  };

  useEffect(() => {
    const onFocus = navigation.addListener('focus', () => {
      setUsuario({
        id,
        nome: 'valor',
        sobrenome: 'valor',
        email: 'valor',
        telefone: 'valor',
        matricula: 'valor',
        cpf: 'valor',
        foto: '',
        isAdmin: true,
      });
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
                <Info label="Telefone" value={usuario?.telefone as string} />
                <Info label="Matrícula" value={usuario?.matricula as string} />
                <Info label="CPF" value={usuario?.cpf as string} />
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
