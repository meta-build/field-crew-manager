import React from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {EquipamentoItem} from '../../../../types';

import colors from '../../../../styles/variables';

import Title from '../../../../components/Title';
import Badget from '../../../../components/Badget';
import Btn from '../../../../components/Button';
import BottomModal from '../../../../components/BottomModal';

const {width} = Dimensions.get('window');

interface Props {
  equipment?: EquipamentoItem;
  visible: boolean;
  onClose: () => void;
  onManeuverOpen: () => void;
}

function ToolModal(props: Props) {
  const nav = useNavigation();

  const openManeuver = (id: string) => {
    props.onManeuverOpen();
    nav.navigate('ToolProfile', {id});
  };

  return (
    <BottomModal visible={props.visible} onPressOutside={() => props.onClose()}>
      <View style={styles.imgView}>
        <Image source={{uri: props.equipment?.img}} style={styles.img} />
      </View>
      <View style={styles.container}>
        <Title color="gray" text={props.equipment?.tipo.value as string} />
        <View style={styles.infoView}>
          <View style={styles.info}>
            <Text style={styles.label}>N° Série:</Text>
            <Text style={styles.value}>{props.equipment?.serial}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.label}>Status:</Text>
            <Badget
              status={
                props.equipment?.status === 'inativo' ? 'deactive' : 'active'
              }
              size="tiny"
            />
          </View>
        </View>
        <View style={styles.btnView}>
          <Btn
            styleType="filled"
            title="Abrir"
            onPress={() => openManeuver(props.equipment?.id as string)}
          />
        </View>
      </View>
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  imgView: {
    backgroundColor: colors.white,
    alignItems: 'center',
    position: 'absolute',
    bottom: '100%',
    width,
    paddingVertical: 24,
    paddingBottom: 28,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  img: {
    height: 150,
    width: undefined,
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  infoView: {
    gap: 8,
  },
  info: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  label: {
    color: colors.dark_gray,
    fontWeight: 'bold',
  },
  value: {
    color: colors.dark_gray,
  },
  btnView: {
    marginVertical: 12,
  },
});

export default ToolModal;
