import React from 'react';
import {Modal, Pressable, StyleSheet, View, ViewProps} from 'react-native';
import colors from '../../styles/variables';

interface Props extends ViewProps {
  visible: boolean;
  onPressOutside: () => void;
}

function BottomModal({onPressOutside, children, visible}: Props) {
  return (
    <>
      <Modal
        visible={visible}
        onRequestClose={() => onPressOutside()}
        transparent
        animationType="fade">
        <View style={styles.background} />
      </Modal>
      <Modal
        visible={visible}
        onRequestClose={() => onPressOutside()}
        transparent
        animationType="slide">
        <Pressable onPress={() => onPressOutside()} style={styles.container}>
          <Pressable style={styles.modal}>{children}</Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column-reverse',
  },
  modalContainer: {
    flex: 1,
  },
  modal: {
    width: '100%',
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    position: 'relative',
  },
});

export default BottomModal;
