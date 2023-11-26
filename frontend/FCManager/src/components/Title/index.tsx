import React from 'react';
import {StyleSheet, Text} from 'react-native';
import colors from '../../styles/variables';

interface Props {
  text: string;
  color: 'green' | 'gray' | 'lightGreen' | 'white';
  align?: 'left' | 'center' | 'right' | 'justify';
}

function Title({text, color, align = 'left'}: Props) {
  const styles = StyleSheet.create({
    title: {
      fontWeight: 'bold',
      fontSize: 24,
      textAlign: align,
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
    white: {
      color: colors.white,
    },
  });

  return <Text style={[styles.title, styles[color]]}>{text}</Text>;
}

export default Title;
