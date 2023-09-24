import React from 'react';
import {GestureResponderEvent, Pressable, StyleSheet, Text} from 'react-native';
import Box from '../../assets/icons/box.svg';
import BoxChecked from '../../assets/icons/boxChecked.svg';
import colors from '../../styles/variables';

interface Props {
  checked: boolean;
  text: string;
  onPress: (event: GestureResponderEvent) => void;
}

function Checkbox({checked, text, onPress}: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {checked ? (
        <BoxChecked width={14} height={14} />
      ) : (
        <Box width={14} height={14} />
      )}
      <Text style={styles.text}>{text}</Text>
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
});

export default Checkbox;
