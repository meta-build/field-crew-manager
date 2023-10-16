import React, { useState } from 'react';
import {Image, StyleSheet, View} from 'react-native';
import colors from '../../styles/variables';

interface Props {
  url: string;
  size?: number;
}

const defaultImg = require('../../assets/images/default-profile-img.png');

function ProfileImage({url, size = 180}: Props) {
  const [error, setError] = useState(false);

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: 200,
      overflow: 'hidden',
      backgroundColor: colors.dark_gray,
    },
    img: {
      width: size,
      height: size,
      resizeMode: 'cover',
    },
  });

  return (
    <View style={styles.container}>
      <Image
        defaultSource={defaultImg}
        source={url && !error ? {uri: url} : defaultImg}
        style={styles.img}
        onError={() => setError(true)}
        onLoad={() => setError(false)}
      />
    </View>
  );
}

export default ProfileImage;
