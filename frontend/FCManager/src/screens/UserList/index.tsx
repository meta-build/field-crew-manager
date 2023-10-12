import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import Header from '../../components/Header/Index';
import InputText from '../../components/InputText';
import Btn from '../../components/Button';

import colors from '../../styles/variables';

import Equipamento from '../../services/Equipamento';

import {EquipamentoItem} from '../../types';
import LoadingToolList from '../../components/LoadingToolList';
import Navbar from '../../components/Navbar';
import UserItem from '../../components/UserItem';

const {width, height} = Dimensions.get('window');

function UserList({navigation}: any) {
  const [loadingList, setLoadingList] = useState(false);

  const [name, setName] = useState('');
  const [lista, setLista] = useState<EquipamentoItem[]>([]);

  const openNewTool = () => {
    navigation.navigate('NewTool');
  };

  const openItem = (serie: string) => {
    navigation.navigate('ToolProfile', {id: serie});
  };

  const cancelFilter = () => {
    setName('');
    getUsuarios('todos');
  };

  const filtrarNome = (titulo: string) => {
    const regex = new RegExp(name, 'i');
    return regex.test(titulo);
  };

  const getUsuarios = async (statusFilter: 'todos' | 'ativo' | 'inativo') => {
    setLoadingList(true);
    await Equipamento.getAll(statusFilter, '', '').then(res => {
      const equips = res.values.filter(equip => filtrarNome(equip.tipo.value));
      setLista(equips);
    });
    setLoadingList(false);
  };

  useEffect(() => {
    const onFocus = navigation.addListener('focus', () => {
      cancelFilter();
    });

    getUsuarios('todos');
    return onFocus;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, navigation]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header text="Usuários" />
        <View style={styles.content}>
          <View style={styles.searchView}>
            <InputText
              placeholder="Pesquisar por nome"
              style={styles.searchInput}
              color="white"
              onChange={e => setName(e.nativeEvent.text)}
              value={name}
            />
          </View>
          <Btn
            onPress={() => openNewTool()}
            styleType="filled"
            title="Adicionar novo usuário"
          />
          {loadingList ? (
            <LoadingToolList />
          ) : (
            <FlatList
              style={styles.equipsList}
              data={lista}
              renderItem={({item}) => (
                <View style={styles.item}>
                  <UserItem
                    user={{
                      foto: item.img,
                      inscricao: item.serial,
                      nome: 'nome',
                      sobrenome: 'sobrenome',
                    }}
                    onPress={() => openItem(item.id)}
                  />
                </View>
              )}
              keyExtractor={item => item.id}
            />
          )}
        </View>
        <Navbar selected="Usuários" navigation={navigation} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white_3,
    width,
    height,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 13,
    gap: 12,
  },
  searchView: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInput: {
    flex: 1,
  },
  item: {
    marginBottom: 12,
  },
  equipsList: {
    flex: 1,
  },
});

export default UserList;
