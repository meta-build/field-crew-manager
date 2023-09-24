import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../styles/variables';

interface Props {
  label: string;
  value: string;
}

function Info({label, value}: Props) {
  return (
    <View>
      <Text style={[styles.text, styles.label]}>{label}:</Text>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: colors.dark_gray,
  },
  label: {
    fontWeight: 'bold',
  },
});

export default Info;
