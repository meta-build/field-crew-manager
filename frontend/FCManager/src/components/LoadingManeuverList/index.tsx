import React from 'react';
import {StyleSheet, View} from 'react-native';
import colors from '../../styles/variables';

function LoadingManeuverItem() {
  return (
    <View style={stylesItem.container}>
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
    height: 92,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  infoContainer: {
    height: '100%',
    padding: 10,
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
 
function LoadingManeuverList() {
  return (
    <View style={styles.list}>
      <LoadingManeuverItem />
      <LoadingManeuverItem />
      <LoadingManeuverItem />
      <LoadingManeuverItem />
      <LoadingManeuverItem />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
});

export default LoadingManeuverList;
