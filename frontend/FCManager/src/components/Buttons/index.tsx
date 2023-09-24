import React from 'react';
import {
  Button,
  ButtonProps,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '../../styles/variables';

interface Props extends ButtonProps {
  color: 'filled';
  enable?: boolean;
}

const Btn = ({enable = true, color, ...props}: Props) => {
  const buttonStyles = {
    borderRadius: 10,
    padding: 6,
    color: colors.white,
  };

  const styles = StyleSheet.create({
    filled: {
      ...buttonStyles,
      backgroundColor: colors.green,
      padding: 10,
      minWidth: 300,
      alignItems: 'center',
      ...(!enable ? {backgroundColor: colors.disabled_green} : {}),
    },
  });

  return (
    <SafeAreaView>
      <View style={{backgroundColor: 'red', borderRadius: 100}}>
        <Pressable onPress={() => console.log('foi')} style={styles[color]}>
          <Text> Filled</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
export default Btn;
