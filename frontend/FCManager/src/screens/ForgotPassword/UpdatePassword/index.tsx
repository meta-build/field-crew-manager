import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import colors from '../../../styles/variables';

import Title from '../../../components/Title';
import Btn from '../../../components/Button';
import InputText from '../../../components/InputText';

import Usuario from '../../../services/Usuario';
import useContexto from '../../../hooks/useContexto';

const img = require('../../../assets/images/password-image.png');

const {width} = Dimensions.get('window');

const AlertMsg = ({children}: any) => {
  return <Text style={styles.alert}>{children}</Text>;
};

function UpdatePassword({navigation}: any) {
  const {code} = useContexto();

  const [loading, setLoading] = useState(false);
  const [dontMatch, setDontMatch] = useState(false);

  const [senhaNova, setSenhaNova] = useState('');
  const [confirmsenhaNova, setConfirmSenhaNova] = useState('');

  const enviarCodigo = async () => {
    setDontMatch(false);
    setLoading(true);
    if (senhaNova !== confirmsenhaNova) {
      setDontMatch(true);
      setLoading(false);
    } else {
      try {
        await Usuario.forgotPassword(code, senhaNova);
        setLoading(false);
        navigation.navigate('ChangePasswordConfirmed');
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <Image style={styles.img} source={img} />
      <Title color="green" text="Alteração de senha" />
      <Text style={styles.text}>Altere a senha nos campos abaixo:</Text>
      <View style={styles.fieldsView}>
        <View>
          <Text style={styles.label}>Nova senha</Text>
          <InputText
            value={senhaNova}
            onChange={e => setSenhaNova(e.nativeEvent.text)}
            color="gray"
            error={dontMatch}
            isPassword
          />
        </View>
        <View>
          <Text style={styles.label}>Confirmar nova senha</Text>
          <InputText
            value={confirmsenhaNova}
            onChange={e => setConfirmSenhaNova(e.nativeEvent.text)}
            color="gray"
            error={dontMatch}
            isPassword
          />
        </View>
        {dontMatch ? (
          <AlertMsg>
            Campos de nova senha e confirmar nova senha não combinam.
          </AlertMsg>
        ) : (
          <></>
        )}
      </View>
      <View style={styles.btnView}>
        <Btn
          loading={loading}
          styleType="outlined"
          title="Enviar"
          onPress={() => enviarCodigo()}
          enable={Boolean(senhaNova && confirmsenhaNova)}
        />
      </View>
    </KeyboardAvoidingView>
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
  label: {
    color: colors.dark_gray,
    marginBottom: 4,
  },
  fieldsView: {
    gap: 12,
    width: 300,
  },
  alert: {
    color: colors.alert_1,
  },
});

export default UpdatePassword;
