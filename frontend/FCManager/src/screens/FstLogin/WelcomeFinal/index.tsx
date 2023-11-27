import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Dimensions, StyleSheet, View} from 'react-native';

import useContexto from '../../../hooks/useContexto';

import Title from '../../../components/Title';
import Btn from '../../../components/Button';
import colors from '../../../styles/variables';

const {width} = Dimensions.get('window');

function WelcomeFinal({navigation}: any) {
  const {usuario} = useContexto();

  return (
    <SafeAreaView style={styles.container}>
      <Title
        color="white"
        text={`Tudo pronto, ${usuario?.nome}.`}
        align="center"
      />
      <Title color="white" text="Bem-vindo ao FCManager!" align="center" />
      <View style={styles.btnView}>
        <Btn
          styleType="blank"
          title="Entrar"
          onPress={() => {
            navigation.navigate('ToolList');
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    position: 'relative',
    backgroundColor: colors.green_1,
  },
  btnView: {
    position: 'absolute',
    bottom: 14,
    width,
    paddingHorizontal: 14,
  },
});

export default WelcomeFinal;
