import React from 'react';
import {Pressable, PressableProps, StyleSheet, Text, View} from 'react-native';

import ExitIcon from '../../assets/icons/exit.svg';
import colors from '../../styles/variables';

function ExitBtn(props: PressableProps) {
  return (
    <View>
      <Pressable onPress={props.onPress} style={styles.btn}>
        <ExitIcon width={18} color={colors.dark_gray} />
        <Text style={styles.text}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  text: {
    color: colors.dark_gray,
    fontSize: 16,
    textDecorationLine: 'underline',
    textDecorationColor: colors.dark_gray,
  },
});

export default ExitBtn;
