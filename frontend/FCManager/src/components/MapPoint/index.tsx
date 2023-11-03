import React, {useEffect} from 'react';
import {Image, StyleSheet} from 'react-native';

interface Props {
  color: 'green' | 'gray';
  selected?: boolean;
  onPress?: () => void;
}

const grayIcon = require('../../assets/images/map-icon-gray.png');
const greenIcon = require('../../assets/images/map-icon-green.png');
const blueIcon = require('../../assets/images/map-icon-blue.png');

function MapPoint(props: Props) {
  useEffect(() => console.log('aqui'));
  return (
    <Image
      style={styles.normal}
      resizeMode="contain"
      source={
        props.selected
          ? blueIcon
          : props.color === 'green'
          ? greenIcon
          : grayIcon
      }
    />
  );
}

const styles = StyleSheet.create({
  normal: {
    width: 18,
    height: 18,
  },
});

export default MapPoint;
