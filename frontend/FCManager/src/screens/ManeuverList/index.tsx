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
import ManeuverItem from '../../components/ManeuverItem';
import Navbar from '../../components/Navbar';
import LoadingManeuverList from '../../components/LoadingManeuverList';
import SwitchBtn from '../../components/SwitchBtn';

import colors from '../../styles/variables';

import FilterIcon from '../../assets/icons/filterGreen.svg';
import MapIcon from '../../assets/icons/map.svg';

import {ManobraItem} from '../../types';

import Manobra from '../../services/Manobra';
import useContexto from '../../hooks/useContexto';

import MapModal from './MapModal';

const {width, height} = Dimensions.get('window');

type StatusType = 'todos' | 'concluido' | 'emAndamento';

function ManeuverList({navigation}: any) {
  const {usuario, location} = useContexto();

  const [filterModal, setFilterModal] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [mapModal, setMapModal] = useState(false);

  const [loadingList, setLoadingList] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [status, setStatus] = useState<StatusType>('todos');
  const [distMaxFilter, setDistMaxFilter] = useState(true);
  const [distMax, setDistMax] = useState(2);
  const [distMaxStr, setDistMaxStr] = useState('2');

  const [lista, setLista] = useState<ManobraItem[]>([]);

  const [filterCount, setFilterCount] = useState(1);

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
    let count = 0;
    if (status !== 'todos') {
      count += 1;
    }
    if (distMaxFilter) {
      count += 1;
    }
    setFilterCount(count);
    getManobras();
    setFilterModal(false);
  };

  const cancelFilter = () => {
    setStatus('todos');
    setTitulo('');
    setFilterCount(1);
    setDistMax(2);
    setDistMaxStr('2');
    setDistMaxFilter(true);
    getManobras();
    setFilterModal(false);
  };

  const filtrarNome = (title: string) => {
    const regex = new RegExp(titulo, 'i');
    return regex.test(title);
  };

  const getManobras = async () => {
    setLoadingList(true);
    await Manobra.getAll(
      distMaxFilter
        ? {
            latitude: location.latitude,
            longitude: location.longitude,
            distance: distMax,
          }
        : undefined,
    )
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
        setLista(manobras);
      })
      .catch(err => console.log(err));
    setLoadingList(false);
  };

  useEffect(() => {
    const onFocus = navigation.addListener('focus', () => {
      cancelFilter();
      setMapModal(false);
      getManobras();

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
                onPress={() => setMapModal(true)}
                styleType="blank"
                icon={<MapIcon width={18} height={15} color={colors.green_1} />}
              />
            </View>
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
            <LoadingManeuverList />
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
          <View style={styles.bufferContainer}>
            <SwitchBtn
              onPress={() => setDistMaxFilter(!distMaxFilter)}
              value={distMaxFilter}
            />
            <View
              style={[
                styles.bufferContainer,
                !distMaxFilter ? styles.unactiveContainer : {},
              ]}>
              <Text style={styles.label}>Distância máxima:</Text>
              <InputText
                color="gray"
                onChange={e => {
                  setDistMaxStr(e.nativeEvent.text);
                  if (!isNaN(Number(e.nativeEvent.text))) {
                    setDistMax(Number(e.nativeEvent.text));
                  }
                }}
                keyboardType="number-pad"
                style={styles.bufferInput}
                value={distMaxFilter ? distMaxStr : '\u221E'}
                enable={distMaxFilter}
                textAlign="center"
              />
              <Text style={styles.label}>Km</Text>
            </View>
          </View>
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
            title="Resetar filtros"
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

      <MapModal
        visible={mapModal}
        onClose={() => setMapModal(false)}
        maneuvers={lista}
        loading={loadingList}
      />
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
  bufferContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 12,
  },
  bufferInput: {
    maxWidth: 52,
  },
  unactiveContainer: {
    opacity: 0.5,
  },
});

export default ManeuverList;
