import React from 'react';
import {StyleSheet, Text} from 'react-native';
import colors from '../../styles/variables';

interface Props {
  text: string;
  color: 'green' | 'gray' | 'lightGreen';
}

function Title({text, color}: Props) {
  return <Text style={[styles.title, styles[color]]}>{text}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  green: {
    color: colors.green_2,
  },
  gray: {
    color: colors.dark_gray,
  },
  lightGreen: {
    color: colors.green_1,
  },
});

export default Title;
