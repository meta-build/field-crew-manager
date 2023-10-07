import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '../../styles/variables';
import Header from '../../components/Header/Index';
import ImageCarousel from '../../components/ImageCarousel';
import Title from '../../components/Title';
import Badget from '../../components/Badget';
import Info from '../../components/Info';
import Btn from '../../components/Button';
import BottomModal from '../../components/BottomModal';
import Equipamento from '../../services/Equipamento';
import {Equipamento as EquipamentoType} from '../../types';

const {width, height} = Dimensions.get('window');

function ToolProfile({navigation, route}: any) {
  const [confirmActive, setConfirmActive] = useState(false);
  const [confirmDeactive, setConfirmDeactive] = useState(false);

  const [equipamento, setEquipamento] = useState<EquipamentoType>();

  const [loading, setLoading] = useState(false);

  const {id} = route.params;

  const edit = () => {
    navigation.navigate('NewTool', {id});
  };

  const activate = () => {
    setConfirmActive(true);
  };

  const deactivate = () => {
    setConfirmDeactive(true);
  };

  const confirmActivate = async () => {
    setLoading(true);
    Equipamento.active(id).then(() => {
      getEquipamento();
      setConfirmActive(false);
      setLoading(false);
    });
  };

  const confirmDeactivate = async () => {
    setLoading(true);
    Equipamento.deactive(id).then(() => {
      getEquipamento();
      setConfirmDeactive(false);
      setLoading(false);
    });
  };

  const getEquipamento = () => {
    Equipamento.getById(id).then(res => {
      setEquipamento(res);
    });
  };

  useEffect(() => {
    const onFocus = navigation.addListener('focus', () => {
      getEquipamento();
    });

    return onFocus;
  }, []);

  if (equipamento) {
    return (
      <>
        <SafeAreaView style={styles.container}>
          <Header text="Equipamentos" />
          <ImageCarousel images={equipamento?.imgs as string[]} />
          <ScrollView style={styles.content}>
            <Title color="gray" text={equipamento?.tipo.value as string} />
            <View style={styles.info}>
              <View style={styles.status}>
                <Text style={styles.label}>Status:</Text>
                <View>
                  <Badget
                    status={
                      equipamento?.status === 'ativo' ? 'active' : 'deactive'
                    }
                    size="small"
                  />
                </View>
              </View>
              <Info label="N° Serial" value={equipamento?.serial as string} />
              <Info label="ID" value={id} />
              <View>
                <Text style={styles.label}>Observações:</Text>
                <Text style={styles.value}>{equipamento?.obs as string}</Text>
              </View>
            </View>
            <View style={styles.btnView}>
              <View style={styles.btn}>
                <Btn
                  onPress={() => edit()}
                  styleType="outlined"
                  title="Editar"
                />
              </View>
              <View style={styles.btn}>
                {equipamento?.status === 'ativo' ? (
                  <Btn
                    onPress={() => deactivate()}
                    styleType="alert"
                    title="Desativar"
                  />
                ) : (
                  <Btn
                    onPress={() => activate()}
                    styleType="filled"
                    title="Ativar"
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>

        <BottomModal
          visible={confirmActive}
          onPressOutside={() => setConfirmActive(false)}>
          <Title color="green" text="Ativar equipamento?" align="center" />
          <View style={styles.confirmBtnView}>
            <Btn
              styleType="filled"
              title="Confirmar"
              onPress={() => !loading && confirmActivate()}
              loading={loading}
            />
            <Btn
              styleType="outlined"
              title="Cancelar"
              onPress={() => setConfirmActive(false)}
            />
          </View>
        </BottomModal>

        <BottomModal
          visible={confirmDeactive}
          onPressOutside={() => setConfirmDeactive(false)}>
          <Title color="green" text="Desativar equipamento?" align="center" />
          <View style={styles.confirmBtnView}>
            <Btn
              styleType="alert"
              title="Confirmar"
              onPress={() => !loading && confirmDeactivate()}
              loading={loading}
            />
            <Btn
              styleType="outlined"
              title="Cancelar"
              onPress={() => setConfirmDeactive(false)}
            />
          </View>
        </BottomModal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: colors.white_3,
  },
  content: {
    backgroundColor: colors.white,
    padding: 16,
  },
  info: {
    marginTop: 18,
    gap: 8,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    color: colors.dark_gray,
    fontWeight: 'bold',
    fontSize: 16,
  },
  value: {
    color: colors.dark_gray,
    textAlign: 'justify',
  },
  btnView: {
    marginVertical: 12,
    flexDirection: 'row',
    width: '100%',
    paddingBottom: 14,
    gap: 12,
  },
  btn: {
    flex: 1,
    height: '100%',
  },
  confirmBtnView: {
    gap: 12,
    marginTop: 36,
  },
});

export default ToolProfile;
