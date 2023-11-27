import React from 'react';
import {GestureResponderEvent, Pressable, StyleSheet, Text} from 'react-native';
import Box from '../../assets/icons/box.svg';
import BoxChecked from '../../assets/icons/boxChecked.svg';
import colors from '../../styles/variables';

interface Props {
  checked: boolean;
  text: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

function Checkbox({checked, text, onPress, disabled}: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {checked ? (
        <BoxChecked
          color={disabled ? colors.gray : colors.dark_gray}
          width={14}
          height={14}
        />
      ) : (
        <Box
          color={disabled ? colors.gray : colors.dark_gray}
          width={14}
          height={14}
        />
      )}
      <Text style={disabled ? styles.textDisabled : styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    color: colors.dark_gray,
  },
  textDisabled: {
    color: colors.gray,
  },
});

export default Checkbox;
