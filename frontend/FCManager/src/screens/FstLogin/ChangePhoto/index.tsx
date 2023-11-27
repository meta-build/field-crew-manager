import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Dimensions, StyleSheet, View} from 'react-native';

import useContexto from '../../../hooks/useContexto';

import Title from '../../../components/Title';
import Btn from '../../../components/Button';
import InputProfileImage from '../../../components/InputProfileImage';

import Usuario from '../../../services/Usuario';

const {width} = Dimensions.get('window');

function ChangePhoto({navigation}: any) {
  const {usuario} = useContexto();

  const [foto, setFoto] = useState('');
  const [loading, setLoading] = useState(false);

  const nextScreen = async () => {
    // requisição p/ editar foto
    setLoading(true);
    try {
      await Usuario.update(
        {
          foto,
          nome: usuario?.nome,
          sobrenome: usuario?.sobrenome,
          email: usuario?.email,
          telefone: usuario?.telefone,
          isAdmin: usuario?.isAdmin,
        },
        usuario?.id as string,
      );
    } catch (e) {
      console.log(e);
    }
    setLoading(false);

    // ir para próxima tela
    navigation.navigate('FstPassword');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.photoView}>
        <Title
          color="lightGreen"
          text="Primeiro, escolha sua foto de perfil"
          align="center"
        />
        <InputProfileImage img={foto} onAddImg={img => setFoto(img)} />
      </View>
      <View style={styles.btnView}>
        <Btn
          styleType="filled"
          title="Continuar"
          onPress={() => nextScreen()}
          loading={loading}
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
});

export default ChangePhoto;
