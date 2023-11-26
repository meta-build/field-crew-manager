import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Dimensions, StyleSheet, View} from 'react-native';

import useContexto from '../../../hooks/useContexto';

import Title from '../../../components/Title';
import Btn from '../../../components/Button';

import ArrowsSVG from '../../../assets/icons/arrows.svg';
import colors from '../../../styles/variables';

const {width} = Dimensions.get('window');

function Welcome({navigation}: any) {
  const {usuario} = useContexto();

  return (
    <SafeAreaView style={styles.container}>
      <Title
        color="lightGreen"
        text={`Bem-vindo, ${usuario?.nome}! Vamos configurar sua conta`}
        align="center"
      />
      <ArrowsSVG width={48} color={colors.green_1} />
      <View style={styles.btnView}>
        <Btn
          styleType="filled"
          title="Continuar"
          onPress={() => {
            navigation.navigate('ChangePhoto');
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
  },
  btnView: {
    position: 'absolute',
    bottom: 14,
    width,
    paddingHorizontal: 14,
  },
});

export default Welcome;
