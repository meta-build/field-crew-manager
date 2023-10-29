import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import PlusIcon from '../../assets/icons/plus.svg';
import {launchImageLibrary} from 'react-native-image-picker';

interface Props {
  imgs: string[];
  onAddImage: (uris: string[]) => void;
  onRemoveImage: (uri: string) => void;
  squareSize?: number;
}

function InputImage({
  imgs = [],
  onAddImage,
  onRemoveImage,
  squareSize = 80,
}: Props) {
  const imgPicker = async () => {
    const options = {
      storageOptions: {
        path: 'image',
      },
      mediaType: 'photo',
      selectionLimit: 0,
    };

    launchImageLibrary(options, response => {
      if (response.assets) {
        const uris = response.assets.map(item => item.uri as string);
        onAddImage(uris);
      }
    });
  };

  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 14,
    },
    image: {
      width: squareSize,
      height: squareSize,
      resizeMode: 'cover',
    },
    plusButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: squareSize,
      height: squareSize,
    },
  });

  return (
    <View style={styles.container}>
      {imgs.length ? (
        imgs.map((img, index) =>
          img ? (
            <TouchableOpacity
              key={index}
              onLongPress={() => Vibration.vibrate()}
              onPressOut={() => onRemoveImage(img)}>
              <Image style={styles.image} source={{uri: img}} />
            </TouchableOpacity>
          ) : (
            <></>
          ),
        )
      ) : (
        <></>
      )}
      <Pressable style={styles.plusButton} onPress={() => imgPicker()}>
        <PlusIcon width={30} height={30} />
      </Pressable>
    </View>
  );
}

export default InputImage;
