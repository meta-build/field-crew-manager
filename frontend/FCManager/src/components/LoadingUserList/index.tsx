import React from 'react';
import {StyleSheet, View} from 'react-native';
import colors from '../../styles/variables';

function LoadingUserItem() {
  return (
    <View style={stylesItem.container}>
      <View style={stylesItem.img} />
      <View style={stylesItem.infoContainer}>
        <View style={stylesItem.title} />
        <View style={stylesItem.info} />
      </View>
    </View>
  );
}

const stylesItem = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 12,
  },
  img: {
    width: 48,
    height: 48,
    borderRadius: 48,
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
});
 
function LoadingUserList() {
  return (
    <View style={styles.list}>
      <LoadingUserItem />
      <LoadingUserItem />
      <LoadingUserItem />
      <LoadingUserItem />
      <LoadingUserItem />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
});

export default LoadingUserList;
