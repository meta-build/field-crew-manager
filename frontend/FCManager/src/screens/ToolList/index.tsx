import React from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import Header from '../../components/Header/Index';
import colors from '../../styles/variables';
import InputText from '../../components/InputText';
import Btn from '../../components/Button';
import FilterIcon from '../../assets/icons/filterGreen.svg';
import ToolItem from '../../components/ToolItem';

const {width, height} = Dimensions.get('window');

function ToolList({navigation}: any) {
  const openFilter = () => {
    console.log('filter');
  };

  const openNewTool = () => {
    console.log('new tool');
  };

  const openItem = (serie: string) => {
    navigation.navigate('ToolProfile', {id: serie});
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

  return (
    <SafeAreaView style={styles.container}>
      <Header text="Equipamentos" />
      <View style={styles.content}>
        <View style={styles.searchView}>
          <InputText
            placeholder="Pesquisar por tipo"
            style={styles.searchInput}
            color="white"
          />
          <Btn
            onPress={() => openFilter()}
            styleType="blank"
            icon={<FilterIcon width={18} height={15} />}
          />
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
});

export default ToolList;
