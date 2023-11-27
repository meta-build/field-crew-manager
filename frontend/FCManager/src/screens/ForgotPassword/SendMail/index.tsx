import React, {useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import useContexto from '../../../hooks/useContexto';
import colors from '../../../styles/variables';
import Usuario from '../../../services/Usuario';

import Title from '../../../components/Title';
import Btn from '../../../components/Button';

const img = require('../../../assets/images/password-image.png');

const {width} = Dimensions.get('window');

function SendMail({navigation}: any) {
  const {tempMail} = useContexto();

  const [loading, setLoading] = useState(false);

  const enviarCodigo = async () => {
    setLoading(true);
    await Usuario.sendCode();
    setLoading(false);
    navigation.navigate('InsertCode');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.img} source={img} />
      <Title color="green" text="Alteração de senha" />
      <Text style={styles.text}>
        Será enviado um código de confirmação no email{' '}
        <Text style={styles.bold}>{tempMail}</Text>
      </Text>
      <View style={styles.btnView}>
        <Btn
          loading={loading}
          styleType="outlined"
          title="Ok"
          onPress={() => enviarCodigo()}
        />
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
  bold: {
    fontWeight: 'bold',
    padding: 4,
  },
  btnView: {
    width,
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 12,
  },
});

export default SendMail;
