import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import colors from '../../styles/variables';

interface Props {
  color: 'green' | 'gray';
  expanded?: boolean;
  onPress?: () => void;
}

function MapPoint(props: Props) {
  return (
    <Pressable
      style={[
        styles.point,
        styles[props.color],
        props.expanded ? styles.expanded : {},
      ]}
      onPress={() => props.onPress && props.onPress()}
    />
  );
}

const styles = StyleSheet.create({
  point: {
    width: 18,
    height: 18,
    borderRadius: 18,
    borderWidth: 3,
  },
  expanded: {
    width: 28,
    height: 28,
    borderWidth: 5,
  },
  green: {
    backgroundColor: colors.green_1,
    borderColor: colors.green_3,
  },
  gray: {
    backgroundColor: colors.gray,
    borderColor: colors.dark_gray,
  },
});

export default MapPoint;
