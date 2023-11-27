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
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../../components/Header/Index';
import InputImage from '../../components/InputImage';
import Checkbox from '../../components/Checkbox';
import InputText from '../../components/InputText';
import Dropdown from '../../components/Dropdown';
import Btn from '../../components/Button';
import BottomModal from '../../components/BottomModal';
import Title from '../../components/Title';
import OverlayLoading from '../../components/OverlayLoading';
import InputLocation from '../../components/InputLocation';

import colors from '../../styles/variables';

import Equipamento from '../../services/Equipamento';
import Tipo from '../../services/Tipo';
import useContexto from '../../hooks/useContexto';

import {Tipo as TipoType} from '../../types';

const {width, height} = Dimensions.get('window');

LogBox.ignoreAllLogs();

const Panel = ({children, style}: any) => {
  return <View style={[styles.panel, style]}>{children}</View>;
};

const AlertMsg = ({children}: any) => {
  return <Text style={styles.alert}>{children}</Text>;
};

function ToolForm({navigation, route}: any) {
  const {location, conected, queue} = useContexto();

  const params = route.params;

  const [imgs, setImgs] = useState<string[]>([]);

  const [types, setTypes] = useState<{value: string; label: string}[]>([]);
  const [newTypeCheck, setNewTypeCheck] = useState(false);
  const [newType, setNewType] = useState('');
  const [selectedTypeValue, setSelectedTypeValue] = useState('');
  const [selectedTypeLabel, setSelectedTypeLabel] = useState('');

  const [latitude, setLatitude] = useState(location.latitude);
  const [longitude, setLongitude] = useState(location.longitude);

  const [serial, setSerial] = useState('');

  const [obs, setObs] = useState('');

  const [confirmModal, setConfirmModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [loadingOverlay, setLoadingOverlay] = useState(false);

  const [imgAlert, setImgAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState(false);
  const [serialAlert, setSerialAlert] = useState(false);
  const [obsAlert, setObsAlert] = useState(false);

  const create = async () => {
    setLoading(true);

    let tipo = '';
    if (newTypeCheck) {
      try {
        const resId = await Tipo.new(newType);
        tipo = resId.id;
      } catch (err) {
        console.log('erro ao criar type', err);
      }
    } else {
      tipo = selectedTypeValue;
    }

    if (params?.id) {
      try {
        await Equipamento.update(
          {
            imgs,
            obs,
            serial,
            tipo,
            latitude,
            longitude,
          },
          params.id,
        );
        setLoading(false);
        navigation.push('ToolList');
        navigation.navigate('ToolProfile', {id: params.id});
      } catch (err) {
        setLoading(false);
        console.log('erro ao criar equip', err);
      }
    } else {
      if (conected) {
        Equipamento.new({
          imgs,
          obs,
          serial,
          tipo,
          latitude,
          longitude,
        })
          .then(res => {
            setLoading(false);
            navigation.push('ToolList');
            navigation.navigate('ToolProfile', {id: res.id});
          })
          .catch(err => {
            setLoading(false);
            console.log('erro ao criar equip', err);
          });
      } else {
        await queue.equipments.addEquipment({
          imgs,
          obs,
          serial,
          tipo,
          latitude,
          longitude,
          tipoValue: selectedTypeLabel,
        });
        setLoading(false);
        navigation.navigate('ToolList');
      }
    }
  };

  const confirm = () => {
    setImgAlert(!imgs.length);
    setTypeAlert(!selectedTypeValue && !newType);
    setSerialAlert(!serial);
    setObsAlert(!obs);

    if (
      !(!imgs.length || (!selectedTypeValue && !newType) || !serial || !obs)
    ) {
      setConfirmModal(true);
    }
  };

  const cancel = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const onFocus = navigation.addListener('focus', async () => {
      if (conected) {
        Tipo.getAll().then(res => {
          const tipos: {value: string; label: string}[] = res.map(tipo => ({
            label: tipo.value,
            value: tipo.id,
          }));
          setTypes(tipos);
        });
      } else {
        try {
          const tiposJSON = await AsyncStorage.getItem('tipos');
          const tipos: {value: string; label: string}[] = JSON.parse(
            tiposJSON as string,
          ).map((tipo: TipoType) => ({
            label: tipo.value,
            value: tipo.id,
          }));
          setTypes(tipos);
        } catch (e) {
          console.log(e);
        }
      }

      if (params?.id) {
        setLoadingOverlay(true);
        await Equipamento.getById(params.id).then(equip => {
          setImgs(equip.imgs);
          setSelectedTypeValue(equip.tipo.id);
          setSerial(equip.serial);
          setObs(equip.obs);
          setNewTypeCheck(false);
          setLatitude(equip.latitude);
          setLongitude(equip.longitude);
        });
        setLoadingOverlay(false);
      } else {
        setImgs([]);
        setNewTypeCheck(false);
        setNewType('');
        setSelectedTypeValue('');
        setSerial('');
        setObs('');
        setLatitude(location.latitude);
        setLongitude(location.longitude);
      }

      setConfirmModal(false);
      setImgAlert(false);
      setTypeAlert(false);
      setSerialAlert(false);
      setObsAlert(false);
    });

    return onFocus;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  return (
    <>
      <OverlayLoading
        visible={loadingOverlay}
        onClose={() => {
          setLoadingOverlay(false);
          cancel();
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <SafeAreaView style={styles.container}>
          <Header
            text={params?.id ? 'Editar Equipamento' : 'Novo Equipamento'}
          />
          <ScrollView>
            <View style={styles.content}>
              <Panel>
                <Text style={styles.panel_label}>Fotos</Text>
                <InputImage
                  onAddImage={imgsUris => {
                    const tempArr = [...imgs, ...imgsUris];
                    setImgs(tempArr);
                  }}
                  onRemoveImage={imgUri => {
                    const tempArr = imgs.filter(img => img !== imgUri);
                    setImgs(tempArr);
                  }}
                  imgs={imgs}
                />
                {imgAlert ? (
                  <AlertMsg>Insira pelo menos 1 imagem.</AlertMsg>
                ) : (
                  <></>
                )}
              </Panel>
              <Panel>
                <Text style={styles.panel_label}>Tipo de equipamento</Text>
                {newTypeCheck ? (
                  <InputText
                    value={newType}
                    onChange={e => setNewType(e.nativeEvent.text)}
                    color="gray"
                    placeholder="Novo tipo"
                  />
                ) : (
                  <Dropdown
                    items={types}
                    placeholder="Tipo"
                    color="gray"
                    onSelect={(value, label) => {
                      setSelectedTypeValue(value);
                      setSelectedTypeLabel(label);
                    }}
                    value={selectedTypeValue}
                  />
                )}
                <Checkbox
                  checked={newTypeCheck}
                  onPress={() => {
                    if (conected) {
                      setNewTypeCheck(!newTypeCheck);
                      setSelectedTypeValue('');
                      setSelectedTypeLabel('');
                      setNewType('');
                    }
                  }}
                  disabled={!conected}
                  text="Novo tipo de equipamento"
                />
                {!conected ? (
                  <Text style={{color: colors.dark_gray}}>
                    Sem conexão: Não é possível criar um novo tipo de
                    equipamento.
                  </Text>
                ) : (
                  <></>
                )}
                {typeAlert ? (
                  <AlertMsg>Selecione 1 tipo de equipamento.</AlertMsg>
                ) : (
                  <></>
                )}
              </Panel>
              <Panel style={styles.fill}>
                <Text style={styles.panel_label}>Demais informações</Text>
                <View>
                  <Text style={styles.label}>N° Serial</Text>
                  <InputText
                    value={serial}
                    onChange={e => setSerial(e.nativeEvent.text)}
                    color="gray"
                  />
                </View>
                {serialAlert ? (
                  <AlertMsg>Equipamento deve possuir N° Serial.</AlertMsg>
                ) : (
                  <></>
                )}
                <View style={[styles.obsView, styles.fill]}>
                  <Text style={styles.label}>Observações</Text>
                  <InputText
                    textAlignVertical="top"
                    style={styles.fill}
                    multiline
                    color="gray"
                    onChange={e => setObs(e.nativeEvent.text)}
                    value={obs}
                  />
                </View>
                {obsAlert ? (
                  <AlertMsg>Equipamento deve possuir observação.</AlertMsg>
                ) : (
                  <></>
                )}
              </Panel>
              <InputLocation
                value={{
                  latitude: latitude || location.latitude,
                  longitude: longitude || location.longitude,
                }}
                onChange={locate => {
                  setLatitude(locate.latitude);
                  setLongitude(locate.longitude);
                }}
              />
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
        <Title
          color="green"
          text={
            params?.id ? 'Editar equipamento?' : 'Cadastrar novo equipamento?'
          }
          align="center"
        />
        {!conected ? (
          <Text style={styles.warningText}>
            Você está sem conexão com a internet. O seu cadastro ficará na fila
            até que a conexão seja restabelecida. Assim que isso acontecer, o
            cadastro será enviado automaticamente para o servidor.
          </Text>
        ) : (
          <></>
        )}
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
  warningText: {
    color: colors.dark_gray,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default ToolForm;
