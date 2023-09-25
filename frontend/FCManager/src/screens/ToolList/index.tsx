import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Header from '../../components/Header/Index';
import colors from '../../styles/variables';
import InputText from '../../components/InputText';
import Btn from '../../components/Button';
import FilterIcon from '../../assets/icons/filterGreen.svg';
import ToolItem from '../../components/ToolItem';
import BottomModal from '../../components/BottomModal';
import Title from '../../components/Title';
import Dropdown from '../../components/Dropdown';

const {width, height} = Dimensions.get('window');

function ToolList({navigation}: any) {
  const [filterModal, setFilterModal] = useState(false);

  const [city, setCity] = useState('');
  const [status, setStatus] = useState('');

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
    setFilterModal(false);
  };

  const cancelFilter = () => {
    setCity('');
    setStatus('');
    setFilterModal(false);
  };

  const lista: {
    tipo: string;
    serie: string;
    status: 'ativo' | 'inativo';
    img: string;
  }[] = [
    {
      tipo: '123123',
      serie: '1233213',
      status: 'ativo',
      img: 'https://plus.unsplash.com/premium_photo-1669638780803-ce74f7f3ea76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    },
    {
      tipo: '123123',
      serie: '1111',
      status: 'inativo',
      img: 'https://plus.unsplash.com/premium_photo-1669638780803-ce74f7f3ea76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    },
  ];

  const cities = [{label: 'sjc', value: 'sjc'}];

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
            />
            <View style={styles.filterView}>
              <Btn
                onPress={() => openFilter()}
                styleType="blank"
                icon={<FilterIcon width={18} height={15} />}
              />
              {city && status ? (
                <Text style={styles.filterBadge}>2</Text>
              ) : city || status ? (
                <Text style={styles.filterBadge}>1</Text>
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
                    n_serie: item.serie,
                    status: item.status === 'ativo' ? 'active' : 'deactive',
                    tipoLabel: item.tipo,
                  }}
                  onPress={() => openItem(item.serie)}
                />
              </View>
            )}
            keyExtractor={item => item.serie}
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
                {label: 'Todos', value: 'all'},
                {label: 'Ativo', value: 'active'},
                {label: 'Inativo', value: 'deactive'},
              ]}
              onSelect={value => {
                if (value === 'all') {
                  setStatus('');
                } else {
                  setStatus(value);
                }
              }}
              color="gray"
              placeholder="Todos"
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
