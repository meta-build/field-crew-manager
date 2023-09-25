import React, {useState} from 'react';
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

const {width, height} = Dimensions.get('window');

function ToolProfile({navigation, route}: any) {
  const [confirmActive, setConfirmActive] = useState(false);
  const [confirmDeactive, setConfirmDeactive] = useState(false);

  const imgs = [
    'https://plus.unsplash.com/premium_photo-1669638780803-ce74f7f3ea76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    'https://plus.unsplash.com/premium_photo-1669640021387-20bdd6d50c2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80',
  ];

  const {id} = route.params;

  const status = 'ativo';

  const edit = () => {
    console.log('editar');
  };

  const activate = () => {
    setConfirmActive(true);
  };

  const deactivate = () => {
    setConfirmDeactive(true);
  };

  const confirmActivate = () => {
    setConfirmActive(false);
    console.log('ativar');
  };

  const confirmDeactivate = () => {
    setConfirmDeactive(false);
    console.log('desativar');
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header text="Equipamentos" />
        <ImageCarousel images={imgs} />
        <ScrollView style={styles.content}>
          <Title color="gray" text="Tipo equipamentyo" />
          <View style={styles.info}>
            <View style={styles.status}>
              <Text style={styles.label}>Status:</Text>
              <View>
                <Badget status="active" size="small" />
              </View>
            </View>
            <Info label="N° Serial" value="123123" />
            <Info label="ID" value={id} />
            <View>
              <Text style={styles.label}>Observações:</Text>
              <Text style={styles.value}>
                {
                  'Suspendisse potenti. Vestibulum orci purususpendisse potenti. Vestibulum orci purususpendisse potenti. Vestibulum orci purususpendisse potenti. Vestibulum orci purususpendisse potenti. Vestibulum orci purususpendisse potenti. Vestibulum orci purususpendisse potenti. Vestibulum orci purususpendisse potenti. Vestibulum orci purus, tincidunt sit amet vehicula at, tempus eget turpis. Integer fringilla sem in pulvinar elementum. Aenean nec blandit est, nec porta arcu. Nulla sapien ante, rhoncus nec diam eu, interdum ultricies augue. Duis nec rutrum velit. Morbi a ullamcorper nulla. Integer volutpat ligula est, ac cursus ipsum scelerisque ut. Sed commodo eros sed tempor accumsan. Mauris posuere, odio id mattis mattis, dui nibh rutrum enim, nec euismod ex nunc at libero. Proin libero diam, consectetur sed nisi eu, aliquet laoreet risus. Ut venenatis tincidunt arcu, accumsan condimentum lorem ullamcorper vel.'
                }
              </Text>
            </View>
          </View>
          <View style={styles.btnView}>
            <View style={styles.btn}>
              <Btn onPress={() => edit()} styleType="outlined" title="Editar" />
            </View>
            <View style={styles.btn}>
              {status === 'ativo' ? (
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
            onPress={() => confirmActivate()}
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
            onPress={() => confirmDeactivate()}
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
