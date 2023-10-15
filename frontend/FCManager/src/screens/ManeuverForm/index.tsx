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
import SelectEquipment from '../../components/SelectEquipment';

import colors from '../../styles/variables';

import {EquipamentoItem} from '../../types';
import Manobra from '../../services/Manobra';
import useContexto from '../../hooks/useContexto';
import {UsuarioContext} from '../../contexts/Contexto';

const {width, height} = Dimensions.get('window');

LogBox.ignoreAllLogs();

const Panel = ({children, style}: any) => {
  return <View style={[styles.panel, style]}>{children}</View>;
};

const AlertMsg = ({children}: any) => {
  return <Text style={styles.alert}>{children}</Text>;
};

function ManeuverForm({navigation, route}: any) {
  const params = route.params;
  const {usuario, setUsuario} = useContexto();

  const [titulo, setTitulo] = useState('');
  const [desc, setDesc] = useState('');
  const [equipamentos, setEquipamentos] = useState<EquipamentoItem[]>([]);

  const [confirmModal, setConfirmModal] = useState(false);

  const [tituloAlert, setTituloAlert] = useState(false);
  const [descAlert, setDescAlert] = useState(false);
  const [equipsAlert, setEquipsAlert] = useState(false);

  const [loading, setLoading] = useState(false);

  const create = () => {
    setLoading(true);

    Manobra.new({
      datetimeInicio: new Date().toISOString(),
      descricao: desc,
      titulo,
      equipamentos: equipamentos.map(equip => equip.id),
    })
      .then(res => {
        setConfirmModal(false);
        setLoading(false);

        const tempUser = {
          ...usuario,
          manobraAtiva: true,
        } as UsuarioContext;
        setUsuario(tempUser);

        navigation.push('ManeuverList');
        navigation.navigate('ManeuverProfile', {id: res.id});
      })
      .catch(err => {
        setConfirmModal(false);
        setLoading(false);
        console.log(err);
      });
  };

  const confirm = () => {
    setTituloAlert(!titulo);
    setDescAlert(!desc);
    setEquipsAlert(!equipamentos.length);

    if (!(!titulo || !desc || !equipamentos.length)) {
      setConfirmModal(true);
    }
  };

  const cancel = () => {
    navigation.goBack();
  };

  const removerEquipamento = (equipId: string) => {
    setEquipamentos(equipsAnt =>
      equipsAnt.filter(equip => equip.id !== equipId),
    );
  };

  useEffect(() => {
    const onFocus = navigation.addListener('focus', () => {
      setTitulo('');
      setDesc('');
      setEquipamentos([]);

      setConfirmModal(false);
      setTituloAlert(false);
      setDescAlert(false);
      setEquipsAlert(false);
    });

    return onFocus;
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <SafeAreaView style={styles.container}>
          <Header text={'Nova Manobra'} />
          <ScrollView>
            <View style={styles.content}>
              <Panel style={styles.fill}>
                <Text style={styles.panel_label}>Informações</Text>
                <View>
                  <Text style={styles.label}>Título</Text>
                  <InputText
                    value={titulo}
                    onChange={e => setTitulo(e.nativeEvent.text)}
                    color="gray"
                    error={tituloAlert}
                  />
                </View>
                {tituloAlert ? (
                  <AlertMsg>Manobra deve possuir título.</AlertMsg>
                ) : (
                  <></>
                )}
                <View style={[styles.obsView, styles.fill]}>
                  <Text style={styles.label}>Descrição</Text>
                  <InputText
                    textAlignVertical="top"
                    style={styles.fill}
                    multiline
                    color="gray"
                    onChange={e => setDesc(e.nativeEvent.text)}
                    value={desc}
                    error={descAlert}
                  />
                </View>
                {descAlert ? (
                  <AlertMsg>Equipamento deve possuir observação.</AlertMsg>
                ) : (
                  <></>
                )}
              </Panel>
              <Panel>
                <Text style={styles.panel_label}>Equipamentos</Text>
                <Text style={styles.obs}>
                  Os equipamentos selecionados serão marcados como “inativo” até
                  a conclusão desta manobra.
                </Text>
                <SelectEquipment
                  equipments={equipamentos}
                  onRemoveEquipment={equip => removerEquipamento(equip.id)}
                  onSelectedEquipments={equips => setEquipamentos(equips)}
                />
                {equipsAlert ? (
                  <AlertMsg>
                    Manobra deve possuir pelo menos 1 equipamento.
                  </AlertMsg>
                ) : (
                  <></>
                )}
              </Panel>
              <View style={styles.btnView}>
                <Btn
                  onPress={() => confirm()}
                  styleType="filled"
                  title={params?.id ? 'Editar' : 'Cadastrar'}
                />
                <Btn
                  onPress={() => cancel()}
                  styleType="outlined"
                  title="Cancelar"
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>

      <BottomModal
        onPressOutside={() => setConfirmModal(false)}
        visible={confirmModal}>
        <Title color="green" text={'Criar nova manobra?'} align="center" />
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
  fill: {
    flex: 1,
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
  obs: {
    color: colors.dark_gray,
    fontSize: 14,
  },
});

export default ManeuverForm;
