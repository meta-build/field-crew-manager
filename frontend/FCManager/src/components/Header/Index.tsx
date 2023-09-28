import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../../styles/variables';

interface Props {
  text: string;
}

const Header = ({text}: Props) => {
  return (
    <View style={styles.header}>
      <Text style={styles.h1}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: {
    fontWeight: 'bold',
    color: colors.green_1,
    fontSize: 24,
  },
});

export default Header;
