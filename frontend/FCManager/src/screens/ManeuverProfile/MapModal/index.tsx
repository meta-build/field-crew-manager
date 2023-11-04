import React from 'react';
import {Dimensions, Modal, StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

import colors from '../../../styles/variables';

import {Manobra as ManobraType} from '../../../types';

import Btn from '../../../components/Button';
import MapPoint from '../../../components/MapPoint';
import useContexto from '../../../hooks/useContexto';

const {width, height} = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  maneuver: ManobraType;
}

function MapModal(props: Props) {
  const {location} = useContexto();

  return (
    <>
      <Modal
        visible={props.visible}
        onRequestClose={() => props.onClose()}
        animationType="slide"
        style={styles.container}>
        <View style={styles.mapView}>
          <MapView
            style={styles.map}
            customMapStyle={mapStyle}
            initialRegion={{
              latitude: props.maneuver.latitude || location.latitude,
              longitude: props.maneuver.longitude || location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation
            loadingEnabled>
            {props.maneuver.latitude && props.maneuver.longitude ? (
              <Marker
                // inserir coordenadas vindas da api
                coordinate={{
                  latitude: props.maneuver.latitude,
                  longitude: props.maneuver.longitude,
                }}>
                <View style={styles.point}>
                  <MapPoint
                    color={props.maneuver.datetimeFim ? 'gray' : 'green'}
                  />
                </View>
              </Marker>
            ) : (
              <></>
            )}
          </MapView>
        </View>
        <View style={styles.btnView}>
          <Btn
            styleType="filled"
            title="Voltar"
            onPress={() => props.onClose()}
          />
        </View>
      </Modal>
    </>
  );
}

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

const styles = StyleSheet.create({
  container: {
    width,
    height,
  },
  mapView: {
    flex: 1,
  },
  map: {
    width,
    flex: 1,
  },
  btnView: {
    padding: 16,
    gap: 13,
    backgroundColor: colors.white_2,
  },
  legendView: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 6,
  },
  legendBtnView: {
    gap: 8,
    marginVertical: 24,
  },
  point: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MapModal;
