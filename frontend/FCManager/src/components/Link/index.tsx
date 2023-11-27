import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import colors from '../../styles/variables';

interface Props {
  text: string;
  onPress: () => void;
}

function Link(props: Props) {
  return (
    <Pressable style={styles.container} onPress={() => props.onPress()}>
      <Text style={styles.text}>{props.text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 12,
  },
  text: {
    color: colors.green_1,
    textDecorationColor: colors.green_1,
    textDecorationLine: 'underline',
  },
});

export default Link;
