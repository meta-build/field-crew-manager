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
import Checkbox from '../../components/Checkbox';
import InputText from '../../components/InputText';
import Btn from '../../components/Button';
import BottomModal from '../../components/BottomModal';
import Title from '../../components/Title';

import colors from '../../styles/variables';
import InputMaskText from '../../components/InputMaskText';

const {width, height} = Dimensions.get('window');

LogBox.ignoreAllLogs();

const Panel = ({children, style}: any) => {
  return <View style={[styles.panel, style]}>{children}</View>;
};

const AlertMsg = ({children}: any) => {
  return <Text style={styles.alert}>{children}</Text>;
};

function UserForm({navigation, route}: any) {
  const params = route.params;

  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setisAdmin] = useState(false);

  const [telefone, setTelefone] = useState('');
  const [matricula, setMatricula] = useState('');
  const [cpf, setCpf] = useState('');

  const [telefoneMask, setTelefoneMask] = useState('');
  const [cpfMask, setCpfMask] = useState('');

  const [confirmModal, setConfirmModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [nomeAlert, setNomeAlert] = useState(false);
  const [sobrenomeAlert, setSobrenomeAlert] = useState(false);
  const [emailAlert, setEmailAlert] = useState(false);
  const [telefoneAlert, setTelefoneAlert] = useState(false);
  const [matriculaAlert, setMatriculaAlert] = useState(false);
  const [cpfAlert, setCpfAlert] = useState(false);

  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidTelefone, setInvalidTelefone] = useState(false);
  const [invalidMatricula, setInvalidMatricula] = useState(false);
  const [invalidCpf, setInvalidCpf] = useState(false);

  const [alreadyCpf, setAlreadyCpf] = useState(false);
  const [alreadyMatricula, setAlreadyMatricula] = useState(false);
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

    if (params?.id) {
    } else {
    }
  };

  const confirm = () => {
    setLoading(true);

    setNomeAlert(!nome);
    setSobrenomeAlert(!sobrenome);
    setEmailAlert(!email);
    setTelefoneAlert(!telefone);
    setMatriculaAlert(!matricula);
    setCpfAlert(!cpf);

    setInvalidEmail(!isEmailValid());
    setInvalidTelefone(!isPhoneNumberValid());
    setInvalidCpf(cpf.length !== 11);
    setInvalidMatricula(matricula.length !== 6);

    // validar se email, cpf, e matrícula já existem


    if (
      !(
        !nomeAlert ||
        !sobrenomeAlert ||
        !emailAlert ||
        !invalidEmail ||
        !alreadyEmail ||
        !telefoneAlert ||
        !invalidTelefone ||
        !matriculaAlert ||
        !invalidMatricula ||
        !alreadyMatricula ||
        !cpfAlert ||
        !invalidCpf ||
        !alreadyCpf
      )
    ) {
      setConfirmModal(true);
    }

    setLoading(false);
  };

  const cancel = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const onFocus = navigation.addListener('focus', () => {
      if (params?.id) {
        // pegar dados do usuário a ser editado
      } else {
        setNome('');
        setSobrenome('');
        setEmail('');
        setTelefone('');
        setMatricula('');
        setCpf('');
        setisAdmin(false);
      }

      setConfirmModal(false);
      setNomeAlert(false);
      setSobrenomeAlert(false);
      setEmailAlert(false);
      setTelefoneAlert(false);
      setMatriculaAlert(false);
      setCpfAlert(false);
    });

    return onFocus;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <SafeAreaView style={styles.container}>
          <Header text={params?.id ? 'Editar Usuário' : 'Novo Usuário'} />
          <ScrollView>
            <View style={styles.content}>
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
                {nomeAlert ? (
                  <AlertMsg>Usuário deve possuir nome.</AlertMsg>
                ) : (
                  <></>
                )}
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
                  <AlertMsg>Usuário deve possuir sobrenome.</AlertMsg>
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
                {emailAlert ? (
                  <AlertMsg>Usuário deve possuir email.</AlertMsg>
                ) : (
                  <></>
                )}
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
                  <AlertMsg>Usuário deve possuir telefone.</AlertMsg>
                ) : (
                  <></>
                )}
                {!telefoneAlert && invalidTelefone ? (
                  <AlertMsg>Telefone inválido.</AlertMsg>
                ) : (
                  <></>
                )}
              </Panel>
              <Panel>
                <Text style={styles.panel_label}>Identificação</Text>
                <View>
                  <Text style={styles.label}>Matrícula</Text>
                  <InputMaskText
                    value={matricula}
                    mask="999999"
                    color="gray"
                    onChangeText={(txt, masktxt) => {
                      setMatricula(masktxt);
                    }}
                    placeholder="000000"
                    keyboardType="number-pad"
                    error={matriculaAlert || invalidMatricula}
                  />
                </View>
                {matriculaAlert ? (
                  <AlertMsg>Usuário deve possuir N° de matrícula.</AlertMsg>
                ) : (
                  <></>
                )}
                {alreadyMatricula ? (
                  <AlertMsg>
                    N° de matrícula já cadastrado anteriormente.
                  </AlertMsg>
                ) : (
                  <></>
                )}
                {!matriculaAlert && invalidMatricula ? (
                  <AlertMsg>N° de Matrícula inválido.</AlertMsg>
                ) : (
                  <></>
                )}
                <View>
                  <Text style={styles.label}>CPF</Text>
                  <InputMaskText
                    mask="999.999.999-99"
                    value={cpfMask}
                    onChangeText={(txt, mask) => {
                      setCpf(txt);
                      setCpfMask(mask);
                    }}
                    color="gray"
                    error={cpfAlert || invalidCpf}
                    placeholder="xxx.xxx.xxx-xx"
                    keyboardType="decimal-pad"
                  />
                </View>
                {cpfAlert ? (
                  <AlertMsg>Usuário deve possuir CPF.</AlertMsg>
                ) : (
                  <></>
                )}
                {alreadyCpf ? (
                  <AlertMsg>CPF já cadastrado anteriormente.</AlertMsg>
                ) : (
                  <></>
                )}
                {!cpfAlert && invalidCpf ? (
                  <AlertMsg>N° de CPF inválido.</AlertMsg>
                ) : (
                  <></>
                )}
              </Panel>
              <Panel>
                <Text style={styles.panel_label}>Permissão</Text>
                <Checkbox
                  checked={isAdmin}
                  onPress={() => setisAdmin(!isAdmin)}
                  text="Usuário administrador"
                />
                <Text style={styles.desc}>
                  Com a opção acima selecionada, este usuário terá acesso à
                  lista de usuários e poderá criar e editar outros usuários.
                </Text>
              </Panel>
              <Panel>
                <Text style={styles.panel_label}>Senha</Text>
                <Text style={styles.desc}>
                  Por padrão, a senha do usuário recém-criado será o cpf
                  inserido até o momento em que o próprio usuário alterar a
                  senha.
                </Text>
              </Panel>
              <View style={styles.btnView}>
                <Btn
                  onPress={() => confirm()}
                  styleType="filled"
                  title={params?.id ? 'Editar' : 'Cadastrar'}
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
        <Title
          color="green"
          text={params?.id ? 'Editar usuário?' : 'Cadastrar novo usuário?'}
          align="center"
        />
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
});

export default UserForm;
