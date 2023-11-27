import React from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import colors from '../../../styles/variables';

import Title from '../../../components/Title';
import Btn from '../../../components/Button';

const img = require('../../../assets/images/check-image.png');

const {width} = Dimensions.get('window');

function ChangePasswordConfirmed({navigation}: any) {
  const voltar = async () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.img} source={img} />
      <Title color="green" text="Senha alterada com sucesso" />
      <Text style={styles.text}>
        Volte para a tela de login e insira sua nova senha.
      </Text>
      <View style={styles.btnView}>
        <Btn styleType="outlined" title="Ok" onPress={() => voltar()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  img: {
    width: '100%',
    height: 190,
    resizeMode: 'center',
    marginVertical: 24,
  },
  text: {
    color: colors.dark_gray,
    textAlign: 'center',
    fontSize: 16,
  },
  btnView: {
    width,
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 12,
  },
});

export default ChangePasswordConfirmed;
