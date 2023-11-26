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
import Dropdown from '../../components/Dropdown';
import SwitchBtn from '../../components/SwitchBtn';

import colors from '../../styles/variables';
import Admin from '../../services/Admin';

const {width, height} = Dimensions.get('window');

LogBox.ignoreAllLogs();

const Panel = ({children, style}: any) => {
  return <View style={[styles.panel, style]}>{children}</View>;
};

const AlertMsg = ({children}: any) => {
  return <Text style={styles.alert}>{children}</Text>;
};

interface ManobraOption {
  label: string;
  value: 'todos' | 'ativo' | 'concluido';
}

interface EquipamentoOption {
  label: string;
  value: 'todos' | 'ativo' | 'inativo';
}

const manobraOptions: ManobraOption[] = [
  {label: 'Todos', value: 'todos'},
  {label: 'Em andamento', value: 'ativo'},
  {label: 'Concluídos', value: 'concluido'},
];

const equipamentoOptions: EquipamentoOption[] = [
  {label: 'Todos', value: 'todos'},
  {label: 'Ativos', value: 'ativo'},
  {label: 'Inativos', value: 'inativo'},
];

function AdmConfig({navigation}: any) {
  const [maxManobras, setMaxManobras] = useState(5);
  const [maxManobrasStr, setMaxManobrasStr] = useState('5');

  const [manobraStatus, setManobraStatus] = useState<ManobraOption>(
    manobraOptions[0],
  );

  const [equipamentoStatus, setEquipamentoStatus] = useState<EquipamentoOption>(
    equipamentoOptions[0],
  );

  const [manobraDistMax, setManobraDistMax] = useState(false);
  const [manobraDistMaxKm, setManobraDistMaxKm] = useState(0);
  const [manobraDistMaxKmStr, setManobraDistMaxKmStr] = useState('0');

  const [equipamentoDistMax, setEquipamentoDistMax] = useState(false);
  const [equipamentoDistMaxKm, setEquipamentoDistMaxKm] = useState(0);
  const [equipamentoDistMaxKmStr, setEquipamentoDistMaxKmStr] = useState('0');

  const [confirmModal, setConfirmModal] = useState(false);

  const [equipamentoDistMaxKmAlert, setEquipamentoDistMaxKmAlert] =
    useState(false);
  const [manobraDistMaxKmAlert, setManobraDistMaxKmAlert] = useState(false);
  const [maxManeuversAlert, setMaxManeuversAlert] = useState(false);

  const [loading, setLoading] = useState(false);

  const create = async () => {
    setLoading(true);

    await Admin.apply({
      defaultEquipmentFilter: {
        equipmentStatus: equipamentoStatus as EquipamentoOption,
        maxDistance: {
          active: equipamentoDistMax,
          maxDistance: equipamentoDistMaxKm,
        },
      },
      maxActiveManeuvers: maxManobras,
      defaultManeuverFilter: {
        maxDistance: {
          active: manobraDistMax,
          maxDistance: manobraDistMaxKm,
        },
        maneuverStatus: manobraStatus as ManobraOption,
      },
    });

    navigation.navigate('OwnUserProfile');
    setLoading(false);
  };

  const confirm = () => {
    setMaxManeuversAlert(false);
    setManobraDistMaxKmAlert(false);
    setEquipamentoDistMaxKmAlert(false);

    if (!maxManobrasStr) {
      setMaxManeuversAlert(true);
    }
    if (!manobraDistMaxKmStr) {
      setManobraDistMaxKmAlert(true);
    }
    if (!equipamentoDistMaxKmStr) {
      setEquipamentoDistMaxKmAlert(true);
    }
    if (maxManobrasStr && manobraDistMaxKmStr && equipamentoDistMaxKmStr) {
      setConfirmModal(true);
    }
  };

  const cancel = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const onFocus = navigation.addListener('focus', async () => {
      const config = await Admin.get();
      setMaxManobras(config.maxActiveManeuvers);
      setMaxManobrasStr(`${config.maxActiveManeuvers}`);
      setManobraStatus(
        manobraOptions.find(option => {
          return (
            option.value === config.defaultManeuverFilter.maneuverStatus.value
          );
        }) as ManobraOption,
      );
      setEquipamentoStatus(
        equipamentoOptions.find(option => {
          return (
            option.value === config.defaultEquipmentFilter.equipmentStatus.value
          );
        }) as EquipamentoOption,
      );
      setManobraDistMax(config.defaultManeuverFilter.maxDistance.active);
      setManobraDistMaxKm(config.defaultManeuverFilter.maxDistance.maxDistance);
      setManobraDistMaxKmStr(
        `${config.defaultManeuverFilter.maxDistance.maxDistance}`,
      );
      setEquipamentoDistMax(config.defaultEquipmentFilter.maxDistance.active);
      setEquipamentoDistMaxKm(
        config.defaultEquipmentFilter.maxDistance.maxDistance,
      );
      setEquipamentoDistMaxKmStr(
        `${config.defaultEquipmentFilter.maxDistance.maxDistance}`,
      );
    });

    return onFocus;
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <SafeAreaView style={styles.container}>
          <Header text={'Configurações Admin'} />
          <ScrollView>
            <View style={styles.content}>
              <Panel>
                <Text style={styles.panel_label}>Manobra</Text>
                <View>
                  <Text style={styles.label}>
                    Máximo de manobras ativas por usuário
                  </Text>
                  <InputText
                    value={maxManobrasStr}
                    onChange={e => {
                      setMaxManobrasStr(e.nativeEvent.text);
                      if (!isNaN(Number(maxManobrasStr))) {
                        setMaxManobras(Number(maxManobrasStr));
                      }
                    }}
                    color="gray"
                    error={maxManeuversAlert}
                    keyboardType="decimal-pad"
                  />
                </View>
                {maxManeuversAlert ? (
                  <AlertMsg>Insira um número válido.</AlertMsg>
                ) : (
                  <></>
                )}
              </Panel>
              <Panel>
                <Text style={styles.panel_label}>Filtro padrão - Manobras</Text>
                <Text style={styles.label}>
                  Filtros por padrão quando usuário entrar na listagem de
                  manobras
                </Text>
                <View>
                  <Text style={styles.label}>Status</Text>
                  <Dropdown
                    items={manobraOptions}
                    placeholder="Todos"
                    color="gray"
                    onSelect={(value, label) =>
                      setManobraStatus({value, label} as ManobraOption)
                    }
                    value={manobraStatus.value}
                  />
                </View>
                <View>
                  <Text style={styles.label}>Distância máxima</Text>
                  <View style={styles.bufferView}>
                    <SwitchBtn
                      onPress={() => setManobraDistMax(!manobraDistMax)}
                      value={manobraDistMax}
                    />
                    <InputText
                      color="gray"
                      onChange={e => {
                        setManobraDistMaxKmStr(e.nativeEvent.text);
                        if (!isNaN(Number(e.nativeEvent.text))) {
                          setManobraDistMaxKm(Number(e.nativeEvent.text));
                        }
                      }}
                      keyboardType="number-pad"
                      style={styles.bufferInput}
                      value={manobraDistMax ? manobraDistMaxKmStr : '\u221E'}
                      enable={manobraDistMax}
                      textAlign="center"
                    />
                    <Text style={styles.label}>Km</Text>
                  </View>
                </View>
                {manobraDistMaxKmAlert ? (
                  <AlertMsg>
                    Insira um número válido como distância máxima ou desative o
                    filtro.
                  </AlertMsg>
                ) : (
                  <></>
                )}
              </Panel>
              <Panel>
                <Text style={styles.panel_label}>
                  Filtro padrão - Equipamentos
                </Text>
                <Text style={styles.label}>
                  Filtros por padrão quando usuário entrar na listagem de
                  equipamentos
                </Text>
                <View>
                  <Text style={styles.label}>Status</Text>
                  <Dropdown
                    items={equipamentoOptions}
                    placeholder="Todos"
                    color="gray"
                    onSelect={(value, label) =>
                      setEquipamentoStatus({value, label} as EquipamentoOption)
                    }
                    value={equipamentoStatus.value}
                  />
                </View>
                <View>
                  <Text style={styles.label}>Distância máxima</Text>
                  <View style={styles.bufferView}>
                    <SwitchBtn
                      onPress={() => setEquipamentoDistMax(!manobraDistMax)}
                      value={equipamentoDistMax}
                    />
                    <InputText
                      color="gray"
                      onChange={e => {
                        setEquipamentoDistMaxKmStr(e.nativeEvent.text);
                        if (!isNaN(Number(e.nativeEvent.text))) {
                          setEquipamentoDistMaxKm(Number(e.nativeEvent.text));
                        }
                      }}
                      keyboardType="number-pad"
                      style={styles.bufferInput}
                      value={
                        equipamentoDistMax ? equipamentoDistMaxKmStr : '\u221E'
                      }
                      enable={equipamentoDistMax}
                      textAlign="center"
                    />
                    <Text style={styles.label}>Km</Text>
                  </View>
                </View>
                {equipamentoDistMaxKmAlert ? (
                  <AlertMsg>
                    Insira um número válido como distância máxima ou desative o
                    filtro.
                  </AlertMsg>
                ) : (
                  <></>
                )}
              </Panel>

              <View style={styles.btnView}>
                <Btn
                  onPress={() => confirm()}
                  styleType="filled"
                  title={'Aplicar configurações'}
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
        <Title color="green" text={'Aplicar configurações?'} align="center" />

        <View style={styles.confirmBtnView}>
          <Btn
            styleType="filled"
            title="Sim"
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
  obs: {
    color: colors.dark_gray,
    fontSize: 14,
  },
  warningText: {
    color: colors.dark_gray,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  bufferInput: {
    width: 52,
  },
  bufferView: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
});

export default AdmConfig;
