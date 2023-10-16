import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StyleSheet,
  View,
} from 'react-native';
import colors from '../../styles/variables';

const {width, height} = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
}

function OverlayLoading({visible, onClose}: Props) {
  return (
    <Modal visible={visible} transparent onRequestClose={() => onClose()}>
      <View style={styles.modal}>
        <ActivityIndicator size={52} color={colors.white} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    width,
    height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OverlayLoading;
