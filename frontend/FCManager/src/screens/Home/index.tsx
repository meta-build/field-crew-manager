import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import colors from '../../styles/variables';
import Btn from '../../components/Button';
import Title from '../../components/Title';

const logo = require('../../assets/images/logo-1.png');
const image = require('../../assets/images/home-image.png');

const {width, height} = Dimensions.get('window');

const Home = ({navigation}: any) => {
  const goToList = () => {
    navigation.navigate('ToolList');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={logo} />
      <View style={styles.content}>
        <Image style={styles.image} source={image} />
        <Title
          align="center"
          color="green"
          text="Gerencie seus equipamentos em campo."
        />
        <Text style={styles.text}>
          O segredo para o sucesso em campo: simplifique o gerenciamento de seus
          equipamentos de forma fácil, intuitiva e eficiente.
        </Text>
      </View>
      <View style={styles.btnContainer}>
        <Btn onPress={() => goToList()} styleType="filled" title="Iniciar" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: colors.white,
  },
  logo: {
    height: 22,
    width: 166.22,
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  image: {
    width: 286.59,
    height: 203,
    marginBottom: 12,
  },
  text: {
    color: colors.dark_gray,
    textAlign: 'center',
  },
  btnContainer: {
    width: '100%',
  },
});

export default Home;
