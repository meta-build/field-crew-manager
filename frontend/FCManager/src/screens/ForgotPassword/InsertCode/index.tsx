import React, {useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import colors from '../../../styles/variables';

import Title from '../../../components/Title';
import Btn from '../../../components/Button';
import InputText from '../../../components/InputText';

import Usuario from '../../../services/Usuario';
import useContexto from '../../../hooks/useContexto';

const img = require('../../../assets/images/password-image.png');

const {width} = Dimensions.get('window');

function InsertCode({navigation}: any) {
  const {code, setCode} = useContexto();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const enviarCodigo = async () => {
    setError(false);
    setLoading(true);
    const res = await Usuario.forgotPassword(code);
    if (res) {
      setLoading(false);
      navigation.navigate('UpdatePassword');
    } else {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.img} source={img} />
      <Title color="green" text="Alteração de senha" />
      <Text style={styles.text}>Informe o código no campo abaixo</Text>
      <View style={{width: 100}}>
        <InputText
          maxLength={5}
          keyboardType="decimal-pad"
          textAlign="center"
          color="gray"
          onChange={e => setCode(e.nativeEvent.text)}
          value={code}
          error={error}
        />
      </View>
      {error ? <Text style={styles.error}>Código incorreto.</Text> : <></>}
      <View style={styles.btnView}>
        <Btn
          loading={loading}
          styleType="outlined"
          title="Enviar"
          onPress={() => enviarCodigo()}
          enable={code.length === 5}
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
  error: {
    color: colors.alert_1,
  },
});

export default InsertCode;
