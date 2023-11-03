import React, {useEffect, useState} from 'react';
import {Dimensions, Modal, StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

import colors from '../../../styles/variables';

import {EquipamentoItem} from '../../../types';

import Btn from '../../../components/Button';
import MapPoint from '../../../components/MapPoint';
import MapLegends from '../../../components/MapLegends';
import BottomModal from '../../../components/BottomModal';
import Title from '../../../components/Title';
import LegendBtn from '../../../components/LegendBtn';
import OverlayLoading from '../../../components/OverlayLoading';

import ToolModal from './ToolModal';

const {width, height} = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  equipments: EquipamentoItem[];
  loading: boolean;
}

function MapModal(props: Props) {
  const [layerModal, setLayerModal] = useState(false);

  const [activeEquipmentsLayer, setActiveEquipmentsLayer] = useState(true);
  const [deactiveEquipmentsLayer, setDeactiveEquipmentsLayer] = useState(false);

  const [selectedEquipment, setSelectedEquipment] = useState<EquipamentoItem>();

  const [markerIsClicked, setMarkerIsClicked] = useState(false);

  useEffect(() => {
    if (!props.visible) {
      setDeactiveEquipmentsLayer(false);
      setActiveEquipmentsLayer(true);
      setSelectedEquipment(undefined);
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
                setSelectedEquipment(undefined);
              }
            }}>
            {/* active equipments layer */}
            {activeEquipmentsLayer &&
              props.equipments
                .filter(equipment => equipment.status === 'ativo')
                .map(equipment => (
                  <Marker
                    key={equipment.id}
                    // inserir coordenadas vindas da api
                    coordinate={{latitude: -1, longitude: -1}}
                    onPress={() => setSelectedEquipment(equipment)}
                    icon={
                      equipment.id === selectedEquipment?.id
                        ? require('../../../assets/images/map-icon-blue.png')
                        : require('../../../assets/images/map-icon-green.png')
                    }
                  />
                ))}
            {/* deactive Equipments layer */}
            {deactiveEquipmentsLayer &&
              props.equipments
                .filter(maneuver => maneuver.status === 'inativo')
                .map((equipment, index) => (
                  <Marker
                    key={equipment.id}
                    // inserir coordenadas vindas da api
                    coordinate={{latitude: index, longitude: index}}
                    onPress={() => setSelectedEquipment(equipment)}
                    icon={
                      equipment.id === selectedEquipment?.id
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
                label: 'Equipamentos ativos',
                disabled: !activeEquipmentsLayer,
              },
              {
                icon: <MapPoint color="gray" />,
                label: 'Equipamentos inativos',
                disabled: !deactiveEquipmentsLayer,
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
            active={activeEquipmentsLayer}
            label="Manobras ativas"
            onPress={() => setActiveEquipmentsLayer(!activeEquipmentsLayer)}
          />
          <LegendBtn
            active={deactiveEquipmentsLayer}
            label="Manobras concluídas"
            onPress={() => setDeactiveEquipmentsLayer(!deactiveEquipmentsLayer)}
          />
        </View>
        <Btn
          styleType="filled"
          title="Confirmar"
          onPress={() => setLayerModal(false)}
        />
      </BottomModal>
      <ToolModal
        equipment={selectedEquipment as EquipamentoItem}
        onClose={() => setSelectedEquipment(undefined)}
        visible={selectedEquipment !== undefined}
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
