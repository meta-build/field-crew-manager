import React, {useEffect, useState} from 'react';
import {FlatList, Modal, StyleSheet, View} from 'react-native';

import Header from '../../Header/Index';
import InputText from '../../InputText';
import LoadingToolList from '../../LoadingToolList';
import {EquipamentoItem} from '../../../types';
import ToolItem from '../../ToolItem';
import Btn from '../../Button';

import colors from '../../../styles/variables';

import Equipamento from '../../../services/Equipamento';
import useContexto from '../../../hooks/useContexto';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  open: boolean;
  onClose: () => void;
  getEquipmentsSelected: (equipments: EquipamentoItem[]) => void;
  selectedEquipments: EquipamentoItem[];
}

function SelectingEquipmentScreen(props: Props) {
  const {conected} = useContexto();

  const [tipoName, setTipoName] = useState('');
  const [lista, setLista] = useState<EquipamentoItem[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const [selectedEquipments, setSelectedEquipments] = useState<
    EquipamentoItem[]
  >(props.selectedEquipments);

  const addItem = (equip: EquipamentoItem) => {
    const tempSelectedEquipments = [...selectedEquipments];
    tempSelectedEquipments.push(equip);
    setSelectedEquipments(tempSelectedEquipments);
  };

  const removeItem = (equip: EquipamentoItem) => {
    const tempSelectedEquipments = [...selectedEquipments];
    setSelectedEquipments(
      tempSelectedEquipments.filter(item => item.id !== equip.id),
    );
  };

  const filtrarNome = (titulo: string) => {
    const regex = new RegExp(tipoName, 'i');
    return regex.test(titulo);
  };

  const getEquipamentos = async () => {
    setLoadingList(true);
    if (conected) {
      await Equipamento.getAll('ativo', '', '').then(res => {
        const equips = res.values.filter(equip =>
          filtrarNome(equip.tipo.value),
        );
        setLista(equips);
      });
    } else {
      const equipsJSON = await AsyncStorage.getItem('equips');
      const equipsTemp: EquipamentoItem[] = JSON.parse(equipsJSON as string);

      setLista(
        equipsTemp.filter(equipment => {
          const filtroNome = filtrarNome(equipment.tipo.value);
          const filtroStatus = equipment.status === 'ativo';

          return filtroNome && filtroStatus;
        }),
      );
    }
    setLoadingList(false);
  };

  useEffect(() => {
    getEquipamentos();
    setSelectedEquipments(props.selectedEquipments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoName, props.selectedEquipments]);

  return (
    <Modal
      visible={props.open}
      onRequestClose={() => props.onClose()}
      animationType="slide">
      <View style={styles.container}>
        <Header text="Selecionar Equipamentos" />
        <View style={styles.content}>
          <InputText
            placeholder="Pesquisar por tipo"
            color="white"
            onChange={e => setTipoName(e.nativeEvent.text)}
            value={tipoName}
          />
          <View style={styles.equipsList}>
            {loadingList ? (
              <LoadingToolList />
            ) : (
              <FlatList
                style={styles.equipsList}
                data={lista}
                renderItem={({item}) => (
                  <View style={styles.item}>
                    <ToolItem
                      checkbox
                      checked={Boolean(
                        selectedEquipments.find(equip => equip.id === item.id),
                      )}
                      tool={{
                        img_uri: item.img,
                        n_serie: item.serial,
                        status: item.status === 'ativo' ? 'active' : 'deactive',
                        tipoLabel: item.tipo.value,
                      }}
                      onPress={() => {
                        if (
                          selectedEquipments.find(equip => equip.id === item.id)
                        ) {
                          removeItem(item);
                        } else {
                          addItem(item);
                        }
                      }}
                    />
                  </View>
                )}
                keyExtractor={item => item.id}
              />
            )}
          </View>
          <View style={styles.btnView}>
            <Btn
              onPress={() => {
                props.getEquipmentsSelected(selectedEquipments);
                props.onClose();
              }}
              styleType="filled"
              title="Selecionar"
            />
            <Btn
              onPress={() => props.onClose()}
              styleType="outlined"
              title="Cancelar"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white_3,
  },
  content: {
    marginHorizontal: 13,
    marginVertical: 16,
    flex: 1,
    gap: 12,
  },
  equipsList: {
    flex: 1,
  },
  item: {
    marginBottom: 12,
  },
  btnView: {
    gap: 12,
  },
});

export default SelectingEquipmentScreen;
