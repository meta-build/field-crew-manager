import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import useDistanceCalculator from '../../hooks/useDistanceCalculator';

const {width, height} = Dimensions.get('window');

type StatusType = 'todos' | 'concluido' | 'emAndamento';

function ManeuverList({navigation}: any) {
  const {usuario, location, conected, queue} = useContexto();

  const distanceCalculator = useDistanceCalculator();

  const [filterModal, setFilterModal] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [mapModal, setMapModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);

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
    if (usuario?.manobrasAtivas && usuario?.manobrasAtivas >= 10) {
      setAlertModal(true);
    } else {
      navigation.navigate('ManeuverForm');
    }
  };

  const openItem = (serie: string) => {
    if (conected) {
      navigation.navigate('ManeuverProfile', {id: serie});
    } else {
      setWarningModal(true);
    }
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

  const downloadManobras = async () => {
    const maneuvers = await Manobra.getAll(undefined);
    await AsyncStorage.setItem('manobras', JSON.stringify(maneuvers.values));
  };

  const getManobras = async () => {
    setLoadingList(true);
    if (conected) {
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
    } else {
      const maneuversJSON = await AsyncStorage.getItem('manobras');
      console.log(maneuversJSON);
      const maneuvers: ManobraItem[] = maneuversJSON
        ? JSON.parse(maneuversJSON)
        : [];
      setLista(
        maneuvers.filter(manobra => {
          const tituloFilter = filtrarNome(manobra.titulo);
          const statusFilter =
            status === 'todos'
              ? true
              : status === 'concluido'
              ? manobra.datetimeFim
              : !manobra.datetimeFim;
          const distFilter = distMaxFilter
            ? distanceCalculator(location, distMax, {
                latitude: manobra.latitude,
                longitude: manobra.longitude,
              })
            : true;

          return tituloFilter && statusFilter && distFilter;
        }),
      );
    }
    setLoadingList(false);
  };

  useEffect(() => {
    const onFocus = navigation.addListener('focus', () => {
      cancelFilter();
      setMapModal(false);
      getManobras();

      if (conected) {
        downloadManobras();
      }

      // ver se usuário possui manobra em andamento
    });
    getManobras();
    return onFocus;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titulo, navigation, conected, queue.maneuvers.queue]);

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
            <ScrollView>
              <View>
                <FlatList
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
                {queue.maneuvers.queue.length !== 0 ? (
                  <>
                    <View style={{marginBottom: 12}}>
                      <Title
                        color="gray"
                        text="Manobras na fila (criação)"
                        align="center"
                      />
                    </View>
                    <FlatList
                      data={queue.maneuvers.queue}
                      renderItem={({item}) => (
                        <View style={styles.item}>
                          <ManeuverItem
                            highlight={true}
                            maneuver={{
                              user: `${usuario?.nome} ${usuario?.sobrenome}`,
                              status: 'active',
                              title: item.titulo,
                              date: undefined,
                            }}
                            onPress={() => {}}
                          />
                        </View>
                      )}
                      keyExtractor={(item, index) => `${index}`}
                    />
                  </>
                ) : (
                  <></>
                )}
              </View>
            </ScrollView>
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
            Não é possível criar mais de 10 manobras ativas simultaneamente.
          </Text>
        </View>
        <Btn
          onPress={() => setAlertModal(false)}
          styleType="filled"
          title="Ok"
        />
      </BottomModal>

      <BottomModal
        onPressOutside={() => setWarningModal(false)}
        visible={warningModal}>
        <View style={styles.cantOpenView}>
          <Title color="green" text="Sem conexão" align="center" />
          <Text style={styles.cantOpenText}>
            Não é possível abrir itens quando não há conexão.
          </Text>
          <Btn
            title="Ok"
            styleType="filled"
            onPress={() => setWarningModal(false)}
          />
        </View>
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
  cantOpenText: {
    fontSize: 16,
    color: colors.dark_gray,
    textAlign: 'center',
  },
  cantOpenView: {
    gap: 24,
  },
});

export default ManeuverList;
