import React from 'react';
import {Dimensions, Pressable, StyleSheet, View, ViewProps} from 'react-native';
import colors from '../../styles/variables';

const {width, height} = Dimensions.get('window');

interface Props extends ViewProps {
  visible: boolean;
  onPressOutside: () => void;
}

function BottomModal({onPressOutside, children, visible}: Props) {
  return (
    <>
      {visible ? (
        <Pressable onPress={() => onPressOutside()} style={styles.container}>
          <View style={styles.modal}>{children}</View>
        </Pressable>
      ) : (
        <></>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    flexDirection: 'column-reverse',
    zIndex: 2,
  },
  modal: {
    width: '100%',
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
    paddingTop: 24,
  },
});

export default BottomModal;
