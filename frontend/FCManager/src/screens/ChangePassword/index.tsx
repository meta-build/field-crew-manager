import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  LogBox,
  Platform,
  Image,
} from 'react-native';

import Header from '../../components/Header/Index';
import InputText from '../../components/InputText';
import Btn from '../../components/Button';
import BottomModal from '../../components/BottomModal';
import Title from '../../components/Title';

import colors from '../../styles/variables';

const {width, height} = Dimensions.get('window');

LogBox.ignoreAllLogs();

const img = require('../../assets/images/password-image.png');

const Panel = ({children, style}: any) => {
  return <View style={[styles.panel, style]}>{children}</View>;
};

const AlertMsg = ({children}: any) => {
  return <Text style={styles.alert}>{children}</Text>;
};

function ChangePassword({navigation, route}: any) {
  const {id} = route.params;

  const [senhaAntiga, setSenhaAntiga] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [confirmsenhaNova, setConfirmSenhaNova] = useState('');

  const [incorrect, setIncorrect] = useState(false);
  const [dontMatch, setDontMatch] = useState(false);

  const [confirmModal, setConfirmModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const update = async () => {
    setLoading(true);

    // requisição para trocar senha (pode retorar erro 401)

    setLoading(false);
    setConfirmModal(false);
  };

  const confirm = () => {
    setLoading(true);

    setDontMatch(!(senhaNova === confirmsenhaNova));

    const validation = senhaNova === confirmsenhaNova;

    if (validation) {
      console.log(validation);
      setConfirmModal(true);
    }

    setLoading(false);
  };

  const cancel = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const onFocus = navigation.addListener('focus', () => {
      // pegar dados do usuário a ser editado

      setConfirmModal(false);
      setDontMatch(false);
      setIncorrect(false);
    });

    return onFocus;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <SafeAreaView style={styles.container}>
          <Header text="Editar meus dados" />
          <ScrollView>
            <View style={styles.content}>
              <Panel>
                <Image style={styles.img} source={img} />
                <View>
                  <Text style={styles.label}>Senha atual</Text>
                  <InputText
                    value={senhaAntiga}
                    onChange={e => setSenhaAntiga(e.nativeEvent.text)}
                    color="gray"
                    error={incorrect}
                    isPassword
                  />
                </View>
                {incorrect ? <AlertMsg>Senha incorreta.</AlertMsg> : <></>}
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
              </Panel>
              <View style={styles.spacing} />
              <View style={styles.btnView}>
                <Btn
                  onPress={() => confirm()}
                  styleType="filled"
                  title={'Editar'}
                  loading={loading}
                />
                <Btn
                  onPress={() => cancel()}
                  styleType="outlined"
                  title="Cancelar"
                  enable={!loading}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>

      <BottomModal
        onPressOutside={() => setConfirmModal(false)}
        visible={confirmModal}>
        <Title color="green" text={'Editar senha?'} align="center" />
        <View style={styles.confirmBtnView}>
          <Btn
            styleType="filled"
            title="Confirmar"
            onPress={() => !loading && update()}
            loading={loading}
          />
          <Btn
            styleType="outlined"
            title="Cancelar"
            onPress={() => setConfirmModal(false)}
          />
        </View>
      </BottomModal>
    </>
  );
}

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: 190,
    resizeMode: 'center',
    marginVertical: 24,
  },
  container: {
    width,
    height: '100%',
    backgroundColor: colors.white_3,
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  content: {
    padding: 16,
    gap: 14,
    minHeight: height - 62,
    flexDirection: 'column',
  },
  panel_label: {
    fontSize: 16,
    color: colors.dark_gray,
    fontWeight: 'bold',
  },
  label: {
    color: colors.dark_gray,
    marginBottom: 4,
  },
  btnView: {
    gap: 12,
  },
  obsView: {
    flexDirection: 'column',
  },
  confirmBtnView: {
    gap: 12,
    marginTop: 36,
  },
  alert: {
    color: colors.alert_1,
  },
  desc: {
    color: colors.dark_gray,
    fontSize: 12,
  },
  spacing: {
    flex: 1,
  },
});

export default ChangePassword;
