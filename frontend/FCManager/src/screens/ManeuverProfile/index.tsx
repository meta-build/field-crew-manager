import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

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

const Panel = ({children}: any) => {
  return <View style={styles.panel}>{children}</View>;
};

function ManeuverProfile({navigation, route}: any) {
  const {id} = route.params;

  const [manobra, setManobra] = useState<ManobraType>();

  const [confirmModal, setConfirmModal] = useState(false);

  const openToolItem = (toolId: string) => {
    navigation.navigate('ToolProfile', {id: toolId});
  };

  const openModal = () => {
    setConfirmModal(true);
  };

  const finalizeManeuver = () => {
    // requisição para concluir manobra selecionada
  };

  useEffect(() => {
    const onFocus = navigation.addListener('focus', () => {
      // pegar manobra e armazenar no state manobra
      setManobra({
        datetimeFim: new Date(),
        datetimeInicio: new Date(),
        descricao: 'asdas',
        equipamentos: [
          {
            id: '123',
            img: 'https://plus.unsplash.com/premium_photo-1694467832488-9bc48ff8d112?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
            serial: '123123',
            status: 'ativo',
            tipo: {
              id: '31123',
              value: 'tipo equip',
            },
          },
          {
            id: '123',
            img: 'https://plus.unsplash.com/premium_photo-1694467832488-9bc48ff8d112?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
            serial: '123123',
            status: 'ativo',
            tipo: {
              id: '31123',
              value: 'tipo equip',
            },
          },
          {
            id: '123',
            img: 'https://plus.unsplash.com/premium_photo-1694467832488-9bc48ff8d112?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
            serial: '123123',
            status: 'ativo',
            tipo: {
              id: '31123',
              value: 'tipo equip',
            },
          },
          {
            id: '123',
            img: 'https://plus.unsplash.com/premium_photo-1694467832488-9bc48ff8d112?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
            serial: '123123',
            status: 'ativo',
            tipo: {
              id: '31123',
              value: 'tipo equip',
            },
          },
          {
            id: '123',
            img: 'https://plus.unsplash.com/premium_photo-1694467832488-9bc48ff8d112?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
            serial: '123123',
            status: 'ativo',
            tipo: {
              id: '31123',
              value: 'tipo equip',
            },
          },
          {
            id: '123',
            img: 'https://plus.unsplash.com/premium_photo-1694467832488-9bc48ff8d112?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
            serial: '123123',
            status: 'ativo',
            tipo: {
              id: '31123',
              value: 'tipo equip',
            },
          },
        ],
        titulo: 'titulo manobra',
        usuario: {
          id: 'q34234',
          nome: 'fulano',
          sobrenome: 'ciclano',
        },
      });
    });

    return onFocus;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header text="Manobras" />
        {manobra ? (
          <ScrollView>
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
                    {manobra.datetimeInicio.toLocaleDateString('pt-BR')} às{' '}
                    {manobra.datetimeInicio.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                {manobra.datetimeFim ? (
                  <View>
                    <Text style={styles.title}>Data e hora de conclusão</Text>
                    <Text style={styles.info}>
                      {manobra.datetimeFim.toLocaleDateString('pt-BR')} às{' '}
                      {manobra.datetimeFim.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                ) : (
                  <></>
                )}
              </Panel>
              <Panel>
                <Text style={styles.title}>Equipamentos utilizados</Text>
                <FlatList
                  data={manobra.equipamentos}
                  renderItem={({item}) => (
                    <MiniToolItem
                      tool={{
                        img_uri: item.img,
                        n_serie: item.serial,
                        status: item.status === 'ativo' ? 'active' : 'deactive',
                        tipoLabel: item.tipo.value,
                      }}
                      onPress={() => openToolItem(item.id)}
                    />
                  )}
                  keyExtractor={item => item.id}
                />
              </Panel>
              <View style={styles.spacing} />
              {!manobra.datetimeFim ? (
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
        ) : (
          <></>
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
          />
          <Btn
            styleType="outlined"
            title="Cancelar"
            onPress={() => setConfirmModal(false)}
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
    // paddingHorizontal: 16,
    gap: 18,
  },
  modalDesc: {
    color: colors.dark_gray,
    textAlign: 'center',
    marginVertical: 18,
  },
});

export default ManeuverProfile;
