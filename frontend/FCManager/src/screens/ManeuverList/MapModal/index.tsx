import React, {useEffect, useState} from 'react';
import {Dimensions, Modal, StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

import colors from '../../../styles/variables';

import {ManobraItem} from '../../../types';

import Btn from '../../../components/Button';
import MapPoint from '../../../components/MapPoint';
import MapLegends from '../../../components/MapLegends';
import BottomModal from '../../../components/BottomModal';
import Title from '../../../components/Title';
import LegendBtn from '../../../components/LegendBtn';
import OverlayLoading from '../../../components/OverlayLoading';

import ManeuverModal from './ManeuverModal';
import useContexto from '../../../hooks/useContexto';

const {width, height} = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  maneuvers: ManobraItem[];
  loading: boolean;
}

function MapModal(props: Props) {
  const {location} = useContexto();

  const [layerModal, setLayerModal] = useState(false);

  const [activeManeuversLayer, setActiveManeuversLayer] = useState(true);
  const [closedManeuversLayer, setClosedManeuversLayer] = useState(false);

  const [selectedManeuver, setSelectedManeuver] = useState<ManobraItem>();

  const [markerIsClicked, setMarkerIsClicked] = useState(false);

  useEffect(() => {
    if (!props.visible) {
      setClosedManeuversLayer(false);
      setActiveManeuversLayer(true);
      setSelectedManeuver(undefined);
      setMarkerIsClicked(false);
    }
  }, [props.visible]);

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
            showsUserLocation
            loadingEnabled
            onPress={() => {
              if (markerIsClicked) {
                setMarkerIsClicked(false);
              } else {
                setSelectedManeuver(undefined);
              }
            }}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}>
            {/* active maneuvers layer */}
            {activeManeuversLayer &&
              props.maneuvers
                .filter(
                  maneuver =>
                    !maneuver.datetimeFim &&
                    maneuver.latitude &&
                    maneuver.longitude,
                )
                .map(maneuver => (
                  <Marker
                    key={maneuver.id}
                    // inserir coordenadas vindas da api
                    coordinate={{
                      latitude: maneuver.latitude,
                      longitude: maneuver.longitude,
                    }}
                    onPress={() => setSelectedManeuver(maneuver)}
                    icon={
                      maneuver.id === selectedManeuver?.id
                        ? require('../../../assets/images/map-icon-blue.png')
                        : require('../../../assets/images/map-icon-green.png')
                    }
                  />
                ))}
            {/* closed maneuvers layer */}
            {closedManeuversLayer &&
              props.maneuvers
                .filter(
                  maneuver =>
                    maneuver.datetimeFim &&
                    maneuver.latitude &&
                    maneuver.longitude,
                )
                .map(maneuver => (
                  <Marker
                    key={maneuver.id}
                    // inserir coordenadas vindas da api
                    coordinate={{
                      latitude: maneuver.latitude,
                      longitude: maneuver.longitude,
                    }}
                    onPress={() => setSelectedManeuver(maneuver)}
                    icon={
                      maneuver.id === selectedManeuver?.id
                        ? require('../../../assets/images/map-icon-blue.png')
                        : require('../../../assets/images/map-icon-gray.png')
                    }
                  />
                ))}
          </MapView>
        </View>
        <View style={styles.btnView}>
          <MapLegends
            legends={[
              {
                icon: <MapPoint color="green" />,
                label: 'Manobras ativas',
                disabled: !activeManeuversLayer,
              },
              {
                icon: <MapPoint color="gray" />,
                label: 'Manobras Concluídas',
                disabled: !closedManeuversLayer,
              },
            ]}
          />
          <Btn
            styleType="outlined"
            title="Camadas"
            onPress={() => setLayerModal(true)}
          />
          <Btn
            styleType="filled"
            title="Voltar"
            onPress={() => props.onClose()}
          />
        </View>
      </Modal>
      <BottomModal
        onPressOutside={() => setLayerModal(false)}
        visible={props.visible && layerModal}>
        <Title color="green" text="Camadas" align="center" />
        <View style={styles.legendBtnView}>
          <LegendBtn
            active={activeManeuversLayer}
            label="Manobras ativas"
            onPress={() => setActiveManeuversLayer(!activeManeuversLayer)}
          />
          <LegendBtn
            active={closedManeuversLayer}
            label="Manobras concluídas"
            onPress={() => setClosedManeuversLayer(!closedManeuversLayer)}
          />
        </View>
        <Btn
          styleType="filled"
          title="Confirmar"
          onPress={() => setLayerModal(false)}
        />
      </BottomModal>
      <ManeuverModal
        maneuver={selectedManeuver as ManobraItem}
        onClose={() => setSelectedManeuver(undefined)}
        visible={selectedManeuver !== undefined}
        onManeuverOpen={() => props.onClose()}
      />
      <OverlayLoading
        visible={props.visible && props.loading}
        onClose={() => props.onClose()}
      />
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
  mapPoint: {
    width: 18,
    height: 18,
  },
});

export default MapModal;
