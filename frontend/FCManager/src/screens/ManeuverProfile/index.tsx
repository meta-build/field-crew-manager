import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Navbar from '../../components/Navbar';
import Header from '../../components/Header/Index';
import Title from '../../components/Title';
import Info from '../../components/Info';
import Badget from '../../components/Badget';
import MiniToolItem from '../../components/MiniToolItem';
import Btn from '../../components/Button';
import BottomModal from '../../components/BottomModal';

import colors from '../../styles/variables';

import {Manobra as ManobraType} from '../../types';

import Manobra from '../../services/Manobra';

import useContexto from '../../hooks/useContexto';
import {UsuarioContext} from '../../contexts/Contexto';
import OpenMapBtn from '../../components/OpenMapBtn';
import MapModal from './MapModal';

const Panel = ({children}: any) => {
  return <View style={styles.panel}>{children}</View>;
};

function ManeuverProfile({navigation, route}: any) {
  const {usuario, setUsuario} = useContexto();

  const {id} = route.params;

  const [manobra, setManobra] = useState<ManobraType | undefined>();

  const [confirmModal, setConfirmModal] = useState(false);

  const [mapModal, setMapModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const openToolItem = (toolId: string) => {
    navigation.navigate('ToolProfile', {id: toolId});
  };

  const openModal = () => {
    setConfirmModal(true);
  };

  const finalizeManeuver = async () => {
    setLoading(true);

    // requisição para concluir manobra selecionada
    await Manobra.finalize(id)
      .then(async () => {
        await getManobra();
        const tempUser = {
          ...usuario,
          manobrasAtivas: (usuario?.manobrasAtivas as number) - 1,
        } as UsuarioContext;
        setUsuario(tempUser);
        await AsyncStorage.setItem('usuario', JSON.stringify(tempUser));
      })
      .catch(err => console.log(err));

    setLoading(false);
    setConfirmModal(false);
  };

  const getManobra = async () => {
    const maneuver = await Manobra.getById(id);
    setManobra(maneuver);
  };

  useEffect(() => {
    const onFocus = navigation.addListener('focus', () => {
      setManobra(undefined);

      // pegar manobra e armazenar no state manobra
      getManobra();
    });

    return onFocus;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header text="Manobras" />
        {manobra ? (
          <>
            <ScrollView contentContainerStyle={styles.scrollView}>
              <View style={styles.content}>
                <Panel>
                  <Title color="gray" text={manobra?.titulo as string} />
                  <Info
                    label="Responsável"
                    value={`${manobra.usuario.nome} ${manobra.usuario.sobrenome}`}
                  />
                  <Info label="Descrição" value={manobra.descricao} />
                </Panel>
                <Panel>
                  <View style={styles.infoView}>
                    <Text style={styles.title}>Status</Text>
                    <View style={styles.badgetView}>
                      {manobra.datetimeFim ? (
                        <Badget status="deactive" customText="Concluído" />
                      ) : (
                        <Badget status="active" customText="Em andamento" />
                      )}
                    </View>
                  </View>
                  <View>
                    <Text style={styles.title}>Data e hora de início</Text>
                    <Text style={styles.info}>
                      {new Date(manobra.datetimeInicio).toLocaleDateString(
                        'pt-BR',
                      )}{' '}
                      às{' '}
                      {new Date(manobra.datetimeInicio).toLocaleTimeString(
                        'pt-BR',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        },
                      )}
                    </Text>
                  </View>
                  {manobra.datetimeFim ? (
                    <View>
                      <Text style={styles.title}>Data e hora de conclusão</Text>
                      <Text style={styles.info}>
                        {new Date(manobra.datetimeFim).toLocaleDateString(
                          'pt-BR',
                        )}{' '}
                        às{' '}
                        {new Date(manobra.datetimeFim).toLocaleTimeString(
                          'pt-BR',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </Text>
                    </View>
                  ) : (
                    <></>
                  )}
                </Panel>
                {manobra.latitude && manobra.longitude ? (
                  <OpenMapBtn onPress={() => setMapModal(true)} />
                ) : (
                  <></>
                )}
                <Panel>
                  <Text style={styles.title}>Equipamentos utilizados</Text>
                  <FlatList
                    data={manobra.equipamentos}
                    renderItem={({item}) => (
                      <MiniToolItem
                        tool={{
                          img_uri: item.img,
                          n_serie: item.serial,
                          tipoLabel: item.tipo,
                        }}
                        onPress={() => openToolItem(item.id)}
                      />
                    )}
                    keyExtractor={item => item.id}
                  />
                </Panel>
                <View style={styles.spacing} />
                {!manobra.datetimeFim && manobra.usuario.id === usuario?.id ? (
                  <Btn
                    styleType="filled"
                    title="Concluir manobra"
                    onPress={() => openModal()}
                  />
                ) : (
                  <></>
                )}
              </View>
            </ScrollView>
            <MapModal
              maneuver={manobra as ManobraType}
              onClose={() => setMapModal(false)}
              visible={mapModal}
            />
          </>
        ) : (
          <View style={styles.loadingView}>
            <ActivityIndicator size={52} color={colors.green_1} />
          </View>
        )}
        <Navbar navigation={navigation} selected="Manobras" />
      </SafeAreaView>
      <BottomModal
        onPressOutside={() => setConfirmModal(false)}
        visible={confirmModal}>
        <View style={styles.modal}>
          <Title color="green" text="Concluir manobra?" align="center" />
          <Text style={styles.modalDesc}>
            Todos os equipamentos serão ativos após a conclusão da manobra
          </Text>
          <Btn
            styleType="filled"
            title="Confirmar"
            onPress={() => finalizeManeuver()}
            loading={loading}
          />
          <Btn
            styleType="outlined"
            title="Cancelar"
            onPress={() => setConfirmModal(false)}
            enable={!loading}
          />
        </View>
      </BottomModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light_gray_1,
  },
  scrollView: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  panel: {
    flexDirection: 'column',
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  title: {
    color: colors.dark_gray,
    fontSize: 16,
    fontWeight: 'bold',
  },
  badgetView: {
    alignSelf: 'flex-start',
  },
  infoView: {
    gap: 8,
  },
  info: {
    color: colors.dark_gray,
  },
  spacing: {
    flex: 1,
  },
  modal: {
    gap: 18,
  },
  modalDesc: {
    color: colors.dark_gray,
    textAlign: 'center',
    marginVertical: 18,
  },
  loadingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  openMapBtnText: {
    color: colors.green_1,
    fontSize: 16,
  },
  openMatBtnBg: {
    position: 'relative',
    padding: 0,
  },
});

export default ManeuverProfile;
