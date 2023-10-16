import React from 'react';
import {Pressable, PressableProps, StyleSheet, View} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

import ProfileImage from '../ProfileImage';

import colors from '../../styles/variables';

import CameraIcon from '../../assets/icons/camera.svg';

interface Props {
  img: string;
  onAddImg: (url: string) => void;
}

function InputImgBtn(props: PressableProps) {
  return (
    <Pressable onPress={props.onPress} style={[styles.inputBtn]}>
      <CameraIcon width={28} color={colors.white} />
    </Pressable>
  );
}

function InputProfileImage(props: Props) {
  const imgPicker = async () => {
    const options = {
      storageOptions: {
        path: 'image',
      },
      mediaType: 'photo',
      selectionLimit: 1,
    };

    launchImageLibrary(options, response => {
      if (response.assets) {
        const uris = response.assets.map(item => item.uri as string);
        props.onAddImg(uris[0]);
      }
    });
  };

  return (
    <View>
      <View style={styles.container}>
        <ProfileImage url={props.img} />
        <InputImgBtn onPress={() => imgPicker()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'center',
  },
  inputBtn: {
    backgroundColor: colors.green_1,
    width: 64,
    height: 64,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default InputProfileImage;
