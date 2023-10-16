import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../styles/variables';

function LoadingToolItem() {
  return (
    <View style={stylesItem.container}>
      <View style={stylesItem.img} />
      <View style={stylesItem.infoContainer}>
        <View style={stylesItem.title} />
        <View style={stylesItem.info} />
        <View style={stylesItem.badget} />
      </View>
    </View>
  );
}

const stylesItem = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: 90,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  img: {
    width: 84,
    height: '100%',
    backgroundColor: colors.light_gray_2,
  },
  infoContainer: {
    height: '100%',
    paddingVertical: 10,
    gap: 8,
  },
  title: {
    height: 18,
    width: 190,
    backgroundColor: colors.light_gray_2,
  },
  info: {
    height: 16,
    width: 150,
    backgroundColor: colors.light_gray_2,
  },
  badget: {
    height: 18,
    width: 54,
    backgroundColor: colors.light_gray_2,
    borderRadius: 12,
  },
});

function LoadingToolList() {
  return (
    <View style={styles.list}>
      <LoadingToolItem />
      <LoadingToolItem />
      <LoadingToolItem />
      <LoadingToolItem />
      <LoadingToolItem />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
});

export default LoadingToolList;
