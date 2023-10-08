import React from 'react';
import {
  Image,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ArrowRight from '../../assets/icons/arrowRightGreen.svg';
import CheckboxIcon from '../../assets/icons/box.svg';
import CheckedboxIcon from '../../assets/icons/filledBoxChecked.svg';

import colors from '../../styles/variables';
import Badget from '../Badget';

interface Props extends PressableProps {
  manobra: {
    titulo: string;
    usuario: {
      nome: string;
      sobrenome: string;
    };
    emAndamento: boolean;
  };
  checkbox?: boolean;
  checked?: boolean;
}

function MiniManeuverItem({manobra, ...props}: Props) {
  return (
    <Pressable
      style={styles.container}
      onPress={props.onPress}
      onPressIn={props.onPressIn}
      onPressOut={props.onPressOut}
      onLongPress={props.onLongPress}>
      <View style={styles.info}>
        <View style={styles.titleView}>
          <Text style={styles.title}>{manobra.titulo}</Text>
          {manobra.emAndamento ? (
            <Badget status="active" customText="Em andamento" />
          ) : (
            <></>
          )}
        </View>
        <View style={styles.value_label}>
          <Text style={styles.desc}>por:</Text>
          <Text
            style={[
              styles.desc,
              styles.label,
            ]}>{`${manobra.usuario.nome} ${manobra.usuario.sobrenome}`}</Text>
        </View>
      </View>
      {!props.checkbox ? (
        <ArrowRight width={10} height={15} />
      ) : !props.checked ? (
        <CheckboxIcon width={16} height={16} />
      ) : (
        <CheckedboxIcon width={16} height={16} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingVertical: 6,
    gap: 12,
    alignItems: 'center',
    overflow: 'hidden',
  },
  info: {
    flex: 1,
    paddingVertical: 4,
  },
  value_label: {
    flexDirection: 'row',
    gap: 4,
  },
  titleView: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    color: colors.dark_gray,
    fontSize: 16,
    fontWeight: 'bold',
  },
  desc: {
    color: colors.dark_gray,
    fontSize: 12,
  },
  label: {
    fontWeight: 'bold',
  },
});

export default MiniManeuverItem;
