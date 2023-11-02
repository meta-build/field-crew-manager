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

const {width, height} = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  maneuvers: ManobraItem[];
  loading: boolean;
}

function MapModal(props: Props) {
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
            showsUserLocation
            loadingEnabled
            onPress={() => {
              if (markerIsClicked) {
                setMarkerIsClicked(false);
              } else {
                setSelectedManeuver(undefined);
              }
            }}>
            {/* active maneuvers layer */}
            {activeManeuversLayer &&
              props.maneuvers
                .filter(maneuver => !maneuver.datetimeFim)
                .map(maneuver => (
                  <Marker
                    key={maneuver.id}
                    // inserir coordenadas vindas da api
                    coordinate={{latitude: -1, longitude: -1}}
                    onPress={() => {
                      setMarkerIsClicked(true);
                      setSelectedManeuver(maneuver);
                    }}>
                    <View style={styles.point}>
                      <MapPoint
                        color={maneuver.datetimeFim ? 'gray' : 'green'}
                        expanded={selectedManeuver?.id === maneuver.id}
                        onPress={() => console.log('foi')}
                      />
                    </View>
                  </Marker>
                ))}
            {/* closed maneuvers layer */}
            {closedManeuversLayer &&
              props.maneuvers
                .filter(maneuver => maneuver.datetimeFim)
                .map((maneuver, index) => (
                  <Marker
                    key={maneuver.id}
                    // inserir coordenadas vindas da api
                    coordinate={{latitude: index, longitude: index}}
                    onPress={() => setSelectedManeuver(maneuver)}>
                    <View style={styles.point}>
                      <MapPoint
                        color={maneuver.datetimeFim ? 'gray' : 'green'}
                        expanded={selectedManeuver?.id === maneuver.id}
                        onPress={() => console.log('foi')}
                      />
                    </View>
                  </Marker>
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
