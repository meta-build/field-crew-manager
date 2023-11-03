import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import colors from '../../styles/variables';

import MapIcon from '../../assets/icons/map.svg';

const imgBg = require('../../assets/images/map-bg.png');

interface Props {
  onPress: () => void;
}

function OpenMapBtn(props: Props) {
  return (
    <Pressable onPress={() => props.onPress()}>
      <View style={[styles.container]}>
        <Image source={imgBg} style={styles.img} />
        <View style={styles.overlay}>
          <MapIcon width={28} color={colors.green_1} />
          <Text style={styles.text}>Localizar no mapa</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    overflow: 'hidden',
    height: 82,
    borderRadius: 16,
  },
  img: {
    resizeMode: 'cover',
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  overlay: {
    position: 'absolute',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  text: {
    color: colors.green_1,
    fontSize: 18,
  },
});

export default OpenMapBtn;
