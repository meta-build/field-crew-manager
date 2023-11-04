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

const {width, height} = Dimensions.get('window');

function ToolList({navigation}: any) {
  const [filterModal, setFilterModal] = useState(false);
  const [mapModal, setMapModal] = useState(false);

  const [loadingList, setLoadingList] = useState(false);

  const [city, setCity] = useState('');
  const [tipoName, setTipoName] = useState('');
  const [status, setStatus] = useState<'todos' | 'ativo' | 'inativo'>('todos');
  const [distMaxFilter, setDistMaxFilter] = useState(true);
  const [distMax, setDistMax] = useState(2);

  const [filterCount, setFilterCount] = useState(1);

  const [lista, setLista] = useState<EquipamentoItem[]>([]);

  const openFilter = () => {
    setFilterModal(true);
  };

  const openNewTool = () => {
    navigation.navigate('ToolForm');
  };

  const openItem = (serie: string) => {
    navigation.navigate('ToolProfile', {id: serie});
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
    getEquipamentos(status, city);
    setFilterModal(false);
  };

  const cancelFilter = () => {
    setCity('');
    setStatus('todos');
    setTipoName('');
    setFilterCount(1);
    setDistMax(2);
    setDistMaxFilter(true);
    getEquipamentos('todos', '');
    setFilterModal(false);
  };

  const filtrarNome = (titulo: string) => {
    const regex = new RegExp(tipoName, 'i');
    return regex.test(titulo);
  };

  const getEquipamentos = async (
    statusFilter: 'todos' | 'ativo' | 'inativo',
    cidade: string,
  ) => {
    setLoadingList(true);
    await Equipamento.getAll(statusFilter, '', cidade).then(res => {
      const equips = res.values.filter(equip => filtrarNome(equip.tipo.value));
      setLista(equips);
    });
    setLoadingList(false);
  };

  useEffect(() => {
    const onFocus = navigation.addListener('focus', () => {
      cancelFilter();
    });

    getEquipamentos(status, city);
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return onFocus;
  }, [tipoName, navigation]);

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
            <FlatList
              style={styles.equipsList}
              data={lista}
              renderItem={({item}) => (
                <View style={styles.item}>
                  <ToolItem
                    tool={{
                      img_uri: item.img,
                      n_serie: item.serial,
                      status: item.status === 'ativo' ? 'active' : 'deactive',
                      tipoLabel: item.tipo.value,
                    }}
                    onPress={() => openItem(item.id)}
                  />
                </View>
              )}
              keyExtractor={item => item.id}
            />
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
                onChange={e => setDistMax(Number(e.nativeEvent.text))}
                keyboardType="number-pad"
                style={styles.bufferInput}
                value={distMaxFilter ? `${distMax}` : '\u221E'}
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
  equipsList: {
    flex: 1,
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

export default ToolList;
