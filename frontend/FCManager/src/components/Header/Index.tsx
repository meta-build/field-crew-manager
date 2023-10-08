import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../../styles/variables';

interface Props {
  text: string;
  runningManeuve?: boolean;
}

const Header = ({text, runningManeuve}: Props) => {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.h1}>{text}</Text>
      </View>
      {runningManeuve ? (
        <Text style={styles.warning}>Você possui uma manobra em andamento</Text>
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: {
    fontWeight: 'bold',
    color: colors.green_1,
    fontSize: 20,
  },
  warning: {
    backgroundColor: colors.green_1,
    color: colors.white,
    fontWeight: 'bold',
    padding: 6,
    textAlign: 'center',
  },
});

export default Header;
