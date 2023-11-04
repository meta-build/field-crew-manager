import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

import EyeIcon from '../../assets/icons/eye.svg';
import ClosedEyeIcon from '../../assets/icons/closedEye.svg';
import colors from '../../styles/variables';

interface Props {
  label: string;
  onPress: () => void;
  active: boolean;
}

function LegendBtn(props: Props) {
  return (
    <Pressable
      onPress={() => props.onPress()}
      style={[styles.container, props.active ? {} : styles.disabled]}>
      {props.active ? (
        <EyeIcon width={24} color={colors.dark_gray} />
      ) : (
        <ClosedEyeIcon width={24} color={colors.dark_gray} />
      )}
      <Text style={styles.label}>{props.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: colors.dark_gray,
    fontSize: 14,
  },
});

export default LegendBtn;
