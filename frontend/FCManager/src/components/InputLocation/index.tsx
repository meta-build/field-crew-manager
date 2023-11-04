import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MapView from 'react-native-maps';
import colors from '../../styles/variables';

import PinIcon from '../../assets/icons/map-pin.svg';

interface Props {
  onChange: (location: {latitude: number; longitude: number}) => void;
  value: {latitude: number; longitude: number};
}

function InputLocation(props: Props) {
  const [delta, setDelta] = useState({
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Localização</Text>
      <View style={styles.mapView}>
        <MapView
          style={styles.map}
          customMapStyle={mapStyle}
          onRegionChangeComplete={locate => {
            props.onChange({
              latitude: locate.latitude,
              longitude: locate.longitude,
            });
            setDelta({
              latitudeDelta: locate.latitudeDelta,
              longitudeDelta: locate.longitudeDelta,
            });
          }}
          showsUserLocation
          region={{
            latitude: props.value.latitude,
            longitude: props.value.longitude,
            latitudeDelta: delta.latitudeDelta,
            longitudeDelta: delta.longitudeDelta,
          }}
        />
        <View style={styles.pinView}>
          <PinIcon width={26} />
        </View>
      </View>
      <View style={styles.coords}>
        <View style={styles.info}>
          <Text style={styles.label}>Latitude:</Text>
          <Text style={styles.value}>{props.value.latitude}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>Longitude:</Text>
          <Text style={styles.value}>{props.value.longitude}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    gap: 12,
  },
  title: {
    color: colors.dark_gray,
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapView: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 190,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  pinView: {
    position: 'absolute',
    bottom: 12,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coords: {
    gap: 6,
  },
  info: {
    flexDirection: 'row',
    gap: 4,
  },
  label: {
    color: colors.dark_gray,
    fontWeight: 'bold',
  },
  value: {
    color: colors.dark_gray,
  },
});

const mapStyle = [
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

export default InputLocation;
