import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

import useContexto from '../../../hooks/useContexto';

import Title from '../../../components/Title';
import Btn from '../../../components/Button';
import InputProfileImage from '../../../components/InputProfileImage';

import Usuario from '../../../services/Usuario';
import InputText from '../../../components/InputText';
import colors from '../../../styles/variables';

const {width} = Dimensions.get('window');

const Panel = ({children, style}: any) => {
  return <View style={[styles.panel, style]}>{children}</View>;
};

const AlertMsg = ({children}: any) => {
  return <Text style={styles.alert}>{children}</Text>;
};

function FstPassword({navigation}: any) {
  const {usuario} = useContexto();

  const [senhaAntiga, setSenhaAntiga] = useState(usuario?.cpf as string);
  const [senhaNova, setSenhaNova] = useState('');
  const [confirmsenhaNova, setConfirmSenhaNova] = useState('');

  const [loading, setLoading] = useState(false);
  const [dontMatch, setDontMatch] = useState(false);

  const nextScreen = async () => {
    // requisição p/ editar senha
    setLoading(true);
    setDontMatch(false);
    try {
      if (senhaNova !== confirmsenhaNova) {
        setDontMatch(true);
      } else {
        await Usuario.updatePassowrd(senhaAntiga, senhaNova);
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);

    // ir para próxima tela
    navigation.navigate('WelcomeFinal');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.photoView}>
        <Title
          color="lightGreen"
          text="Agora, defina sua nova senha"
          align="center"
        />
        <Panel>
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
              Campos de nova senha e confirmar nova senha devem ser iguais.
            </AlertMsg>
          ) : (
            <></>
          )}
        </Panel>
      </View>
      <View style={styles.btnView}>
        <Btn
          styleType="filled"
          title="Continuar"
          onPress={() => nextScreen()}
          loading={loading}
          enable={Boolean(senhaNova && confirmsenhaNova)}
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
  photoView: {
    padding: 12,
    gap: 16,
  },
  btnView: {
    position: 'absolute',
    bottom: 14,
    width,
    paddingHorizontal: 14,
  },
  label: {
    color: colors.dark_gray,
    marginBottom: 4,
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  alert: {
    color: colors.alert_1,
  },
});

export default FstPassword;
