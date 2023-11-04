import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import colors from '../../styles/variables';

interface Props {
  onPress: () => void;
  value: boolean;
}

function SwitchBtn(props: Props) {
  return (
    <Pressable
      style={[styles.container, props.value ? styles.containerActive : {}]}
      onPress={() => props.onPress()}>
      <View
        style={[styles.circle, props.value ? styles.active : styles.unactive]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
    width: 48,
    height: 30,
    backgroundColor: colors.light_gray_1,
    borderRadius: 16,
  },
  containerActive: {
    alignItems: 'flex-end',
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 24,
  },
  active: {
    backgroundColor: colors.green_1,
  },
  unactive: {
    backgroundColor: colors.gray,
  },
});

export default SwitchBtn;
