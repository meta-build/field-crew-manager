import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import colors from '../../styles/variables';
import useContexto from '../../hooks/useContexto';
import InterrogationIcon from '../../assets/icons/interrogation.svg';
import BottomModal from '../BottomModal';
import Title from '../Title';
import Btn from '../Button';

interface Props {
  text: string;
}

const Header = ({text}: Props) => {
  const {usuario, conected} = useContexto();

  const [connectionModal, setConnectionModal] = useState(false);

  return (
    <>
      <View>
        <View style={styles.header}>
          <Text style={styles.h1}>{text}</Text>
        </View>
        {usuario?.manobrasAtivas && conected ? (
          <Text style={styles.warning}>
            Você possui {usuario.manobrasAtivas}{' '}
            {usuario.manobrasAtivas > 1 ? 'manobras' : 'manobra'} em andamento
          </Text>
        ) : (
          <></>
        )}
        {!conected ? (
          <Pressable
            style={styles.warningConnection}
            onPress={() => setConnectionModal(true)}>
            <Text style={styles.warningConnectionText}>
              Sem conexão com a internet.
            </Text>
            <InterrogationIcon width={24} color={colors.white} />
          </Pressable>
        ) : (
          <></>
        )}
      </View>
      <BottomModal
        visible={connectionModal}
        onPressOutside={() => setConnectionModal(false)}>
        <View style={styles.modalConnectionView}>
          <Title color="green" text="Sem conexão" align="center" />
          <Text style={styles.modalConnectionText}>
            Você está sem acesso à internet. Por isso, não é possível ver ou
            editar os detalhes dos equipamentos, manobras e usuários. Mas não se
            preocupe: as novas informações que você inserir serão sincronizadas
            com o servidor assim que a conexão for restabelecida. Enquanto isso,
            você ainda pode visualizar a lista dos equipamentos e manobras e o
            mapa do local.
          </Text>
          <Btn
            styleType="filled"
            title="Ok"
            onPress={() => setConnectionModal(false)}
          />
        </View>
      </BottomModal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: {
    fontWeight: 'bold',
    color: colors.green_1,
    fontSize: 20,
  },
  warning: {
    backgroundColor: colors.green_1,
    color: colors.white,
    fontWeight: 'bold',
    padding: 6,
    textAlign: 'center',
  },
  warningConnection: {
    backgroundColor: colors.gray_2,
    color: colors.white,
    fontWeight: 'bold',
    padding: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningConnectionText: {
    fontWeight: 'bold',
    color: colors.white,
  },
  modalConnectionView: {
    gap: 24,
  },
  modalConnectionText: {
    color: colors.dark_gray,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Header;
