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

interface Props extends PressableProps {
  user: {
    foto: string;
    nome: string;
    sobrenome: string;
    inscricao: string;
  };
  checkbox?: boolean;
  checked?: boolean;
}

function UserItem({user, ...props}: Props) {
  return (
    <Pressable
      style={styles.container}
      onPress={props.onPress}
      onPressIn={props.onPressIn}
      onPressOut={props.onPressOut}
      onLongPress={props.onLongPress}>
      <View style={styles.imgView}>
        <Image
          style={styles.img}
          source={{
            uri: user.foto,
          }}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>
          {user.nome} {user.sobrenome}
        </Text>
        <View style={styles.value_label}>
          <Text style={[styles.desc, styles.label]}>N° Inscrição:</Text>
          <Text style={styles.desc}>{user.inscricao}</Text>
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
    padding: 8,
    gap: 12,
    borderRadius: 12,
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
  imgView: {
    width: 48,
    height: 48,
    borderRadius: 48,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  img: {
    width: 48,
    height: 48,
    resizeMode: 'cover',
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

export default UserItem;
