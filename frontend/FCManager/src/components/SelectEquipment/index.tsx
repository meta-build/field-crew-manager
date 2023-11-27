import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import colors from '../../styles/variables';

import XIcon from '../../assets/icons/x.svg';
import SelectingEquipmentScreen from './SelectingEquipmentScreen';

import {EquipamentoItem} from '../../types';

interface Props {
  equipments: EquipamentoItem[];
  onSelectedEquipments: (equip: EquipamentoItem[]) => void;
  onRemoveEquipment: (equip: EquipamentoItem) => void;
  squareSize?: number;
}

function SelectEquipment({
  equipments = [],
  onSelectedEquipments,
  onRemoveEquipment,
}: Props) {
  const [screen, setScreen] = useState(false);

  const openSelectScreen = () => {
    setScreen(true);
  };

  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    equipment: {
      padding: 6,
      backgroundColor: colors.gray,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 10,
      maxWidth: '100%',
    },
    addButton: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.green_1,
      padding: 6,
      borderRadius: 10,
      paddingHorizontal: 10,
    },
    equipmentText: {
      maxWidth: 200,
    },
    badgetText: {
      color: colors.white,
      fontSize: 12,
    },
  });

  return (
    <>
      <View style={styles.container}>
        {equipments.length ? (
          equipments.map(equipment =>
            equipment ? (
              <Pressable
                key={equipment.id}
                style={styles.equipment}
                onPress={() => onRemoveEquipment(equipment)}>
                <Text style={[styles.badgetText, styles.equipmentText]}>
                  {equipment.tipo.value}
                </Text>
                <XIcon width={8} height={8} color={colors.white} />
              </Pressable>
            ) : (
              <></>
            ),
          )
        ) : (
          <></>
        )}
        <Pressable style={styles.addButton} onPress={() => openSelectScreen()}>
          <Text style={styles.badgetText}>Adicionar</Text>
        </Pressable>
      </View>
      <SelectingEquipmentScreen
        getEquipmentsSelected={list => onSelectedEquipments(list)}
        onClose={() => setScreen(false)}
        open={screen}
        selectedEquipments={equipments}
      />
    </>
  );
}

export default SelectEquipment;
