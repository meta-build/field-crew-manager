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
import ToolItem from '../../components/ToolItem';
import BottomModal from '../../components/BottomModal';
import Title from '../../components/Title';
import Dropdown from '../../components/Dropdown';
import LoadingToolList from '../../components/LoadingToolList';
import Navbar from '../../components/Navbar';

import colors from '../../styles/variables';

import FilterIcon from '../../assets/icons/filterGreen.svg';
import MapIcon from '../../assets/icons/map.svg';

import Equipamento from '../../services/Equipamento';

import {EquipamentoItem} from '../../types';

import MapModal from './MapModal';
import SwitchBtn from '../../components/SwitchBtn';
import useContexto from '../../hooks/useContexto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useDistanceCalculator from '../../hooks/useDistanceCalculator';
import Tipo from '../../services/Tipo';

const {width, height} = Dimensions.get('window');

function ToolList({navigation}: any) {
  const {location, conected, queue} = useContexto();
  const distanceFilter = useDistanceCalculator();

  const [filterModal, setFilterModal] = useState(false);
  const [mapModal, setMapModal] = useState(false);
  const [cantOpenModal, setCantOpenModal] = useState(false);

  const [loadingList, setLoadingList] = useState(false);

  const [tipoName, setTipoName] = useState('');
  const [status, setStatus] = useState<'todos' | 'ativo' | 'inativo'>('todos');
  const [distMaxFilter, setDistMaxFilter] = useState(true);
  const [distMax, setDistMax] = useState(2);
  const [distMaxStr, setDistMaxStr] = useState('2');

  const [filterCount, setFilterCount] = useState(1);

  const [lista, setLista] = useState<EquipamentoItem[]>([]);

  const openFilter = () => {
    setFilterModal(true);
  };

  const openNewTool = () => {
    navigation.navigate('ToolForm');
  };

  const openItem = (serie: string) => {
    if (conected) {
      navigation.navigate('ToolProfile', {id: serie});
    } else {
      setCantOpenModal(true);
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
    getEquipamentos();
    setFilterModal(false);
  };

  const cancelFilter = () => {
    setStatus('todos');
    setTipoName('');
    setFilterCount(1);
    setDistMax(2);
    setDistMaxStr('2');
    setDistMaxFilter(true);
    getEquipamentos();
    setFilterModal(false);
  };

  const filtrarNome = (titulo: string) => {
    const regex = new RegExp(tipoName, 'i');
    return regex.test(titulo);
  };

  const DownloadEquipamentos = async () => {
    try {
      const equips = await Equipamento.getAll('todos', '', undefined);
      await AsyncStorage.setItem('equips', JSON.stringify(equips.values));

      const tipos = await Tipo.getAll();
      await AsyncStorage.setItem('tipos', JSON.stringify(tipos));
    } catch (e) {
      console.log(e);
    }
  };

  const getEquipamentos = async () => {
    setLoadingList(true);

    if (conected) {
      await Equipamento.getAll(
        status,
        '',
        distMaxFilter
          ? {
              latitude: location.latitude,
              longitude: location.longitude,
              distance: distMax,
            }
          : undefined,
      ).then(res => {
        const equips = res.values.filter(equip =>
          filtrarNome(equip.tipo.value),
        );
        setLista(equips);
      });
    } else {
      try {
        const equipsJSON = await AsyncStorage.getItem('equips');
        console.log(equipsJSON);
        const equips: EquipamentoItem[] = JSON.parse(equipsJSON as string);
        setLista(
          equips.filter(equip => {
            const filtroNome = filtrarNome(equip.tipo.value);
            const filtroStatus =
              status === 'todos' ? true : equip.status === status;
            const filtroDistancia = distMaxFilter
              ? distanceFilter(location, distMax, {
                  latitude: equip.latitude,
                  longitude: equip.longitude,
                })
              : true;
            return filtroNome && filtroStatus && filtroDistancia;
          }),
        );
      } catch (e) {
        console.log(e);
      }
    }
    setLoadingList(false);
  };

  useEffect(() => {
    const onFocus = navigation.addListener('focus', () => {
      cancelFilter();
      getEquipamentos();
      if (conected) {
        DownloadEquipamentos();
      }
    });

    getEquipamentos();
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return onFocus;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoName, navigation, conected]);

  useEffect(() => {
    getEquipamentos();
  }, [queue.equipments.queue]);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header text="Equipamentos" />
        <View style={styles.content}>
          <View style={styles.searchView}>
            <InputText
              placeholder="Pesquisar por tipo"
              style={styles.searchInput}
              color="white"
              onChange={e => setTipoName(e.nativeEvent.text)}
              value={tipoName}
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
            onPress={() => openNewTool()}
            styleType="filled"
            title="Adicionar novo equipamento"
          />
          {loadingList ? (
            <LoadingToolList />
          ) : (
            <ScrollView>
              <View>
                <FlatList
                  data={lista}
                  renderItem={({item}) => (
                    <View style={styles.item}>
                      <ToolItem
                        tool={{
                          img_uri: item.img,
                          n_serie: item.serial,
                          status:
                            item.status === 'ativo' ? 'active' : 'deactive',
                          tipoLabel: item.tipo.value,
                        }}
                        onPress={() => openItem(item.id)}
                      />
                    </View>
                  )}
                  keyExtractor={item => item.id}
                />
                {queue.equipments.queue.length !== 0 ? (
                  <>
                    <View style={{marginBottom: 12}}>
                      <Title
                        color="gray"
                        text="Equipamentos na fila"
                        align="center"
                      />
                    </View>
                    <FlatList
                      data={queue.equipments.queue}
                      renderItem={({item}) => (
                        <View style={styles.item}>
                          <ToolItem
                            loading
                            tool={{
                              img_uri: item.imgs[0],
                              n_serie: item.serial,
                              status: 'active',
                              tipoLabel: item.tipoValue,
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
        <Navbar selected="Equipamentos" navigation={navigation} />
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
                {label: 'Ativo', value: 'ativo'},
                {label: 'Inativo', value: 'inativo'},
              ]}
              onSelect={value => {
                setStatus(value as 'ativo' | 'inativo' | 'todos');
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
        onPressOutside={() => setCantOpenModal(false)}
        visible={cantOpenModal}>
        <View style={styles.cantOpenView}>
          <Title color="green" text="Sem conexão" align="center" />
          <Text style={styles.cantOpenText}>
            Não é possível abrir itens quando não há conexão.
          </Text>
          <Btn
            title="Ok"
            styleType="filled"
            onPress={() => setCantOpenModal(false)}
          />
        </View>
      </BottomModal>

      <MapModal
        visible={mapModal}
        onClose={() => setMapModal(false)}
        equipments={lista}
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

export default ToolList;
