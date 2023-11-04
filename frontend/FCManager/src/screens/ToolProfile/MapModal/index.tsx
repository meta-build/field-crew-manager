import React from 'react';
import {Dimensions, Modal, StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

import colors from '../../../styles/variables';

import {Equipamento as EquipamentoType} from '../../../types';

import Btn from '../../../components/Button';
import MapPoint from '../../../components/MapPoint';

import useContexto from '../../../hooks/useContexto';

const {width, height} = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  equipement: EquipamentoType;
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
              latitude: props.equipement.latitude || location.latitude,
              longitude: props.equipement.longitude || location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation
            loadingEnabled>
            {props.equipement.latitude && props.equipement.longitude ? (
              <Marker
                // inserir coordenadas vindas da api
                coordinate={{
                  latitude: props.equipement.latitude,
                  longitude: props.equipement.longitude,
                }}>
                <View style={styles.point}>
                  <MapPoint
                    color={
                      props.equipement.status === 'inativo' ? 'gray' : 'green'
                    }
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
