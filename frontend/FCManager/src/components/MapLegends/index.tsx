import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../styles/variables';

interface Props {
  legends: {
    icon: React.JSX.Element;
    label: string;
    disabled: boolean;
  }[];
}

function MapLegends({legends}: Props) {
  return (
    <View style={styles.container}>
      {legends.map(legend => (
        <View
          style={[styles.legendView, legend.disabled ? styles.disabled : {}]}>
          {legend.icon}
          <Text style={styles.label}>{legend.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    flexWrap: 'wrap',
  },
  legendView: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  label: {
    color: colors.dark_gray,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default MapLegends;
