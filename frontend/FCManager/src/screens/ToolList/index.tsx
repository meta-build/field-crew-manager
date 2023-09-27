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

import colors from '../../styles/variables';

import FilterIcon from '../../assets/icons/filterGreen.svg';

import Equipamento from '../../services/Equipamento';

import {EquipamentoItem} from '../../types';

const {width, height} = Dimensions.get('window');

function ToolList({navigation}: any) {
  const [filterModal, setFilterModal] = useState(false);

  const [city, setCity] = useState('');
  const [tipoName, setTipoName] = useState('');
  const [status, setStatus] = useState<'todos' | 'ativo' | 'inativo'>('todos');
  const [lista, setLista] = useState<EquipamentoItem[]>([]);
  const [filterCount, setFilterCount] = useState(0);

  const cities = [{label: 'sjc', value: 'sjc'}];

  const openFilter = () => {
    setFilterModal(true);
  };

  const openNewTool = () => {
    navigation.navigate('NewTool');
  };

  const openItem = (serie: string) => {
    navigation.navigate('ToolProfile', {id: serie});
  };

  const confirmFilter = () => {
    if (city && status !== 'todos') {
      setFilterCount(2);
    } else if (city || status !== 'todos') {
      setFilterCount(1);
    } else {
      setFilterCount(0);
    }
    getEquipamentos(status, city);
    setFilterModal(false);
  };

  const cancelFilter = () => {
    setCity('');
    setStatus('todos');
    setFilterCount(0);
    getEquipamentos('todos', '');
    setFilterModal(false);
  };

  const filtrarNome = (titulo: string) => {
    const regex = new RegExp(tipoName, 'i');
    return regex.test(titulo);
  };

  const getEquipamentos = (
    statusFilter: 'todos' | 'ativo' | 'inativo',
    cidade: string,
  ) => {
    Equipamento.getAll(statusFilter, '', cidade).then(res => {
      console.log(res);
      const equips = res.values.filter(equip => filtrarNome(equip.tipo.value));
      setLista(equips);
    });
  };

  useEffect(() => {
    getEquipamentos('todos', '');
  }, [tipoName]);

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
            onPress={() => openNewTool()}
            styleType="filled"
            title="Adicionar novo equipamento"
          />
          <FlatList
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
        </View>
      </SafeAreaView>
      <BottomModal
        onPressOutside={() => setFilterModal(false)}
        visible={filterModal}>
        <Title color="green" text="Filtros" align="center" />
        <View style={styles.filterFields}>
          <View>
            <Text style={styles.label}>Cidade</Text>
            <Dropdown
              items={cities}
              onSelect={value => setCity(value)}
              color="gray"
              placeholder="Cidade"
            />
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
            title="Limpar filtros"
          />
        </View>
      </BottomModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white_3,
    width,
    height,
  },
  content: {
    flex: 1,
    paddingVertical: 16,
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
});

export default ToolList;
