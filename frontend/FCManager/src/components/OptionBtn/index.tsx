import React from 'react';
import {Pressable, PressableProps, StyleSheet, Text} from 'react-native';

import colors from '../../styles/variables';

import ArrowIcon from '../../assets/icons/arrowRightGreen.svg';

interface Props extends PressableProps {
  label: string;
}

function OptionBtn({label, ...props}: Props) {
  return (
    <Pressable
      style={styles.container}
      onPress={props.onPress}
      onPressIn={props.onPressIn}
      onPressOut={props.onPressOut}
      onLongPress={props.onLongPress}>
      <Text style={styles.label}>{label}</Text>
      <ArrowIcon height={25} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    alignItems: 'center',
    overflow: 'hidden',
  },
  label: {
    color: colors.dark_gray,
    fontSize: 16,
    flex: 1,
  },
});

export default OptionBtn;
