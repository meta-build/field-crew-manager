import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Header from '../../components/Header/Index';
import InputText from '../../components/InputText';
import Btn from '../../components/Button';
import BottomModal from '../../components/BottomModal';
import Title from '../../components/Title';
import Dropdown from '../../components/Dropdown';

import colors from '../../styles/variables';

import FilterIcon from '../../assets/icons/filterGreen.svg';

import {ManobraItem} from '../../types';

import LoadingToolList from '../../components/LoadingToolList';
import Navbar from '../../components/Navbar';
import ManeuverItem from '../../components/ManeuverItem';
import Manobra from '../../services/Manobra';
import useContexto from '../../hooks/useContexto';

const {width, height} = Dimensions.get('window');

type StatusType = 'todos' | 'concluido' | 'emAndamento';

function ManeuverList({navigation}: any) {
  const {usuario} = useContexto();

  const [filterModal, setFilterModal] = useState(false);
  const [alertModal, setAlertModal] = useState(false);

  const [loadingList, setLoadingList] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [status, setStatus] = useState<StatusType>('todos');

  const [lista, setLista] = useState<ManobraItem[]>([]);

  const [filterCount, setFilterCount] = useState(0);

  const openFilter = () => {
    setFilterModal(true);
  };

  const openManeuverForm = () => {
    if (usuario?.manobraAtiva) {
      setAlertModal(true);
    } else {
      navigation.navigate('ManeuverForm');
    }
  };

  const openItem = (serie: string) => {
    navigation.navigate('ManeuverProfile', {id: serie});
  };

  const confirmFilter = () => {
    if (status !== 'todos') {
      setFilterCount(1);
    } else {
      setFilterCount(0);
    }
    getManobras();
    setFilterModal(false);
  };

  const cancelFilter = () => {
    setStatus('todos');
    setTitulo('');
    setFilterCount(0);
    getManobras();
    setFilterModal(false);
  };

  const filtrarNome = (title: string) => {
    const regex = new RegExp(titulo, 'i');
    return regex.test(title);
  };

  const getManobras = async () => {
    setLoadingList(true);
    await Manobra.getAll()
      .then(res => {
        const manobras = res.values.filter(manobra => {
          const tituloFilter = filtrarNome(manobra.titulo);
          const statusFilter =
            status === 'todos'
              ? true
              : status === 'concluido'
              ? manobra.datetimeFim
              : !manobra.datetimeFim;
          return tituloFilter && statusFilter;
        });
        console.log(manobras);
        setLista(manobras);
      })
      .catch(err => console.log(err));
    setLoadingList(false);
  };

  useEffect(() => {
    const onFocus = navigation.addListener('focus', () => {
      cancelFilter();

      // ver se usuário possui manobra em andamento
    });
    getManobras();
    return onFocus;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titulo, navigation]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header text="Manobras" />
        <View style={styles.content}>
          <View style={styles.searchView}>
            <InputText
              placeholder="Pesquisar por título"
              style={styles.searchInput}
              color="white"
              onChange={e => setTitulo(e.nativeEvent.text)}
              value={titulo}
            />
            <View style={styles.filterView}>
              <Btn
                onPress={() => openFilter()}
                styleType="blank"
                icon={<FilterIcon width={18} height={15} />}
              />
              {filterCount > 0 ? (
                <Text style={styles.filterBadge}>{filterCount}</Text>
              ) : (
                <></>
              )}
            </View>
          </View>
          <Btn
            onPress={() => openManeuverForm()}
            styleType="filled"
            title="Criar nova manobra"
          />
          {loadingList ? (
            <LoadingToolList />
          ) : (
            <FlatList
              style={styles.equipsList}
              data={lista}
              renderItem={({item}) => (
                <View style={styles.item}>
                  <ManeuverItem
                    highlight={
                      !item.datetimeFim && item.usuario.id === usuario?.id
                    }
                    maneuver={{
                      user: `${item.usuario.nome} ${item.usuario.sobrenome}`,
                      status: !item.datetimeFim ? 'active' : 'deactive',
                      title: item.titulo,
                      date: item.datetimeFim ? item.datetimeFim : undefined,
                    }}
                    onPress={() => openItem(item.id)}
                  />
                </View>
              )}
              keyExtractor={item => item.id}
            />
          )}
        </View>
        <Navbar selected="Manobras" navigation={navigation} />
      </SafeAreaView>

      <BottomModal
        onPressOutside={() => setFilterModal(false)}
        visible={filterModal}>
        <Title color="green" text="Filtros" align="center" />
        <View style={styles.filterFields}>
          <View>
            <Text style={styles.label}>Status</Text>
            <Dropdown
              items={[
                {label: 'Todos', value: 'todos'},
                {label: 'Em Andamento', value: 'emAndamento'},
                {label: 'Concluído', value: 'concluido'},
              ]}
              onSelect={value => {
                setStatus(value as 'emAndamento' | 'concluido' | 'todos');
              }}
              color="gray"
              placeholder="Todos"
              value={status}
            />
          </View>
        </View>
        <View style={styles.filterBtnView}>
          <Btn
            onPress={() => confirmFilter()}
            styleType="filled"
            title="Confirmar"
          />
          <Btn
            onPress={() => cancelFilter()}
            styleType="outlined"
            title="Limpar filtros"
          />
        </View>
      </BottomModal>

      <BottomModal
        onPressOutside={() => setAlertModal(false)}
        visible={alertModal}>
        <View style={styles.alertView}>
          <Title color="green" text="Atenção" align="center" />
          <Text style={styles.alertTxt}>
            Não é possível criar uma nova manobra enquanto possui outra ativa.
          </Text>
        </View>
        <Btn
          onPress={() => setAlertModal(false)}
          styleType="filled"
          title="Ok"
        />
      </BottomModal>
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
  filterFields: {
    gap: 12,
    marginVertical: 18,
  },
  filterBtnView: {
    gap: 8,
    marginTop: 10,
  },
  label: {
    color: colors.dark_gray,
    marginBottom: 4,
  },
  filterView: {
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    fontWeight: 'bold',
    fontSize: 12,
    width: 22,
    height: 22,
    backgroundColor: colors.green_1,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 8,
    bottom: -8,
    left: -8,
  },
  equipsList: {
    flex: 1,
  },
  alertView: {
    gap: 8,
    marginBottom: 48,
  },
  alertTxt: {
    textAlign: 'center',
    color: colors.dark_gray,
  },
});

export default ManeuverList;
