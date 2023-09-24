import React from 'react';
import {Pressable, PressableProps, StyleSheet, Text} from 'react-native';
import colors from '../../styles/variables';

import ArrowLeft from '../../assets/icons/arrowLeftGreen.svg';
import ArrowRight from '../../assets/icons/arrowRightGreen.svg';

interface Props extends PressableProps {
  value: number | 'left' | 'right';
  status?: 'normal' | 'disabled' | 'active';
  size?: number;
}

function ButtonPage({value, status = 'normal', size = 24, ...props}: Props) {
  const transformValue = () => {
    const iconSize = size / 2;

    switch (value) {
      case 'left':
        return <ArrowLeft width={iconSize} height={iconSize} />;
      case 'right':
        return <ArrowRight width={iconSize} height={iconSize} />;
      default:
        return <Text style={styles.text}>{`${value}`}</Text>;
    }
  };

  const transformBackground = () => {
    switch (status) {
      case 'disabled':
        return colors.gray;
      case 'active':
        return colors.green_1;
      default:
        return colors.white;
    }
  };

  const transformTextColor = () => {
    switch (status) {
      case 'disabled':
        return colors.green_2;
      case 'active':
        return colors.white;
      default:
        return colors.green_1;
    }
  };

  const transformBorderColor = () => {
    switch (status) {
      case 'normal':
        return colors.green_1;
      case 'disabled':
        return colors.green_2;
    }
  };

  const styles = StyleSheet.create({
    button: {
      width: size,
      height: size,
      backgroundColor: transformBackground(),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      ...(status !== 'active'
        ? {borderColor: transformBorderColor(), borderWidth: 2}
        : {}),
    },
    text: {
      color: transformTextColor(),
    },
  });

  return (
    <Pressable style={styles.button} onPress={props.onPress}>
      {transformValue()}
    </Pressable>
  );
}

export default ButtonPage;
