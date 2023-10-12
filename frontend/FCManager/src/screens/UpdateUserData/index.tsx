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
} from 'react-native';

import Header from '../../components/Header/Index';
import InputText from '../../components/InputText';
import Btn from '../../components/Button';
import BottomModal from '../../components/BottomModal';
import Title from '../../components/Title';
import InputMaskText from '../../components/InputMaskText';
import InputProfileImage from '../../components/InputProfileImage';

import colors from '../../styles/variables';

const {width, height} = Dimensions.get('window');

LogBox.ignoreAllLogs();

const Panel = ({children, style}: any) => {
  return <View style={[styles.panel, style]}>{children}</View>;
};

const AlertMsg = ({children}: any) => {
  return <Text style={styles.alert}>{children}</Text>;
};

function UpdateUserData({navigation, route}: any) {
  const {id} = route.params;

  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [foto, setFoto] = useState('');

  const [telefoneMask, setTelefoneMask] = useState('');

  const [confirmModal, setConfirmModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [nomeAlert, setNomeAlert] = useState(false);
  const [sobrenomeAlert, setSobrenomeAlert] = useState(false);
  const [emailAlert, setEmailAlert] = useState(false);
  const [telefoneAlert, setTelefoneAlert] = useState(false);

  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidTelefone, setInvalidTelefone] = useState(false);

  const [alreadyEmail, setAlreadyEmail] = useState(false);

  function isEmailValid(): boolean {
    // Expressão regular para validar o formato do email
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

    // Testa o email em relação à expressão regular
    const result = emailRegex.test(email);
    return result;
  }

  function isPhoneNumberValid(): boolean {
    // Remove caracteres não numéricos do número de telefone
    const cleanedPhone = telefone.replace(/\D/g, '');

    // Valida se o número tem 11 dígitos, que é um formato típico para números de telefone
    if (cleanedPhone.length !== 13) {
      return false;
    }

    if (cleanedPhone.charAt(4) !== '9') {
      return false;
    }

    return true; // Retorna verdadeiro se todas as validações passarem
  }

  const create = async () => {
    setLoading(true);
  };

  const confirm = () => {
    setLoading(true);

    setNomeAlert(!nome);
    setSobrenomeAlert(!sobrenome);
    setEmailAlert(!email);
    setTelefoneAlert(!telefone);

    setInvalidEmail(!isEmailValid());
    setInvalidTelefone(!isPhoneNumberValid());

    // validar se email, cpf, e matrícula já existem

    const validation =
      nome &&
      sobrenome &&
      email &&
      telefone &&
      isEmailValid() &&
      isPhoneNumberValid();

    if (validation) {
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
      setNomeAlert(false);
      setSobrenomeAlert(false);
      setEmailAlert(false);
      setTelefoneAlert(false);
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
                <Text style={styles.panel_label}>Foto</Text>
                <InputProfileImage img={foto} onAddImg={img => setFoto(img)} />
              </Panel>
              <Panel>
                <Text style={styles.panel_label}>Informações básicas</Text>
                <View>
                  <Text style={styles.label}>Nome</Text>
                  <InputText
                    value={nome}
                    onChange={e => setNome(e.nativeEvent.text)}
                    color="gray"
                    error={nomeAlert}
                    placeholder="Nome"
                  />
                </View>
                {nomeAlert ? <AlertMsg>Nome obrigatório.</AlertMsg> : <></>}
                <View>
                  <Text style={styles.label}>Sobrenome</Text>
                  <InputText
                    value={sobrenome}
                    onChange={e => setSobrenome(e.nativeEvent.text)}
                    color="gray"
                    error={sobrenomeAlert}
                    placeholder="Sobrenome"
                  />
                </View>
                {sobrenomeAlert ? (
                  <AlertMsg>Sobrenome obrigatório.</AlertMsg>
                ) : (
                  <></>
                )}
                <View>
                  <Text style={styles.label}>Email</Text>
                  <InputText
                    value={email}
                    onChange={e => setEmail(e.nativeEvent.text)}
                    color="gray"
                    error={emailAlert || invalidEmail}
                    keyboardType="email-address"
                    placeholder="exemplo@dominio.com"
                  />
                </View>
                {emailAlert ? <AlertMsg>Email obrigatório.</AlertMsg> : <></>}
                {alreadyEmail ? (
                  <AlertMsg>Email já cadastrado anteriormente.</AlertMsg>
                ) : (
                  <></>
                )}
                {!emailAlert && invalidEmail ? (
                  <AlertMsg>Email inválido</AlertMsg>
                ) : (
                  <></>
                )}
                <View>
                  <Text style={styles.label}>Telefone</Text>
                  <InputMaskText
                    value={telefoneMask}
                    onChangeText={(txt, txtMask) => {
                      setTelefone(txt);
                      setTelefoneMask(txtMask);
                    }}
                    mask="+99 (99) 99999-9999"
                    color="gray"
                    error={telefoneAlert || invalidTelefone}
                    keyboardType="number-pad"
                    placeholder="+xx (xx) 9xxxx-xxxx"
                  />
                </View>
                {telefoneAlert ? (
                  <AlertMsg>Telefone obrigatório.</AlertMsg>
                ) : (
                  <></>
                )}
                {!telefoneAlert && invalidTelefone ? (
                  <AlertMsg>Telefone inválido.</AlertMsg>
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
        <Title color="green" text={'Editar seus dados?'} align="center" />
        <View style={styles.confirmBtnView}>
          <Btn
            styleType="filled"
            title="Confirmar"
            onPress={() => !loading && create()}
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

export default UpdateUserData;
