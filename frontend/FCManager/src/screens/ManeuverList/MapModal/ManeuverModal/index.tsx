import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {ManobraItem} from '../../../../types';

import colors from '../../../../styles/variables';

import Title from '../../../../components/Title';
import Badget from '../../../../components/Badget';
import Btn from '../../../../components/Button';
import BottomModal from '../../../../components/BottomModal';

import useContexto from '../../../../hooks/useContexto';

interface Props {
  maneuver?: ManobraItem;
  visible: boolean;
  onClose: () => void;
  onManeuverOpen: () => void;
}

function ManeuverModal(props: Props) {
  const {usuario, conected} = useContexto();
  const nav = useNavigation();

  const convertBadgeText = () => {
    if (!props.maneuver?.datetimeFim) {
      return 'Em andamento';
    } else {
      const text = `Finalizado em ${new Date(
        props.maneuver?.datetimeFim as string,
      ).toLocaleDateString('pt-BR')} às ${new Date(
        props.maneuver?.datetimeFim as string,
      ).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
      return text;
    }
  };

  const openManeuver = (id: string) => {
    props.onManeuverOpen();
    nav.navigate('ManeuverProfile', {id});
  };

  return (
    <BottomModal visible={props.visible} onPressOutside={() => props.onClose()}>
      <View style={styles.container}>
        <Title color="gray" text={props.maneuver?.titulo as string} />
        <View style={styles.infoView}>
          <View style={styles.info}>
            <Text style={styles.label}>Responsável:</Text>
            {props.maneuver?.usuario.id === usuario?.id ? (
              <Text style={styles.label}>você</Text>
            ) : (
              <Text
                style={
                  styles.value
                }>{`${props.maneuver?.usuario.nome} ${props.maneuver?.usuario.sobrenome}`}</Text>
            )}
          </View>
          <View style={styles.badgeView}>
            <Badget
              status={props.maneuver?.datetimeFim ? 'deactive' : 'active'}
              size="tiny"
              customText={convertBadgeText()}
            />
          </View>
        </View>
        <View style={styles.btnView}>
          <Btn
            styleType="filled"
            title="Abrir"
            onPress={() => openManeuver(props.maneuver?.id as string)}
            enable={conected}
          />
          {!conected ? (
            <Text style={[styles.value, {textAlign: 'center'}]}>
              Sem conexão.
            </Text>
          ) : (
            <></>
          )}
        </View>
      </View>
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  infoView: {
    gap: 8,
  },
  info: {
    flexDirection: 'row',
    gap: 6,
  },
  label: {
    color: colors.dark_gray,
    fontWeight: 'bold',
  },
  value: {
    color: colors.dark_gray,
  },
  badgeView: {
    alignSelf: 'flex-start',
  },
  btnView: {
    marginVertical: 12,
    gap: 12,
  },
});

export default ManeuverModal;
