import React, {useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import colors from '../../styles/variables';

import ImageIcon from '../../assets/icons/image-white.svg';

interface Props {
  images: string[];
}

const {width} = Dimensions.get('window');

const viewConfigRef = {viewAreaCoveragePercentThreshold: 95};

function ImageCarousel(props: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  let flatListRef = useRef<FlatList<string> | null>();

  const onViewRef = useRef(({changed}: {changed: any}) => {
    if (changed[0].isViewable) {
      setCurrentIndex(changed[0].index);
    }
  });

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({animated: true, index: index});
  };

  return (
    <View>
      <FlatList
        data={props.images}
        renderItem={item => (
          <TouchableOpacity style={styles.imageBackground} activeOpacity={1}>
            <Image source={{uri: item.item}} style={styles.image} />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        ref={ref => {
          flatListRef.current = ref;
        }}
        style={styles.carousel}
        viewabilityConfig={viewConfigRef}
        onViewableItemsChanged={onViewRef.current}
      />

      {props.images.length ? (
        <></>
      ) : (
        <TouchableOpacity
          style={[styles.imageBackground, styles.noImageView]}
          activeOpacity={1}>
          <View>
            <ImageIcon width={84} height={84} />
          </View>
        </TouchableOpacity>
      )}

      <LinearGradient
        style={styles.dotContainer}
        colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']}>
        {props.images.map((img, index: number) => (
          <TouchableOpacity
            key={index.toString()}
            style={
              styles[index === currentIndex ? 'circleActive' : 'circleDeactive']
            }
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </LinearGradient>
    </View>
  );
}

const circleStyle = {
  width: 8,
  height: 8,
  borderRadius: 5,
  marginHorizontal: 5,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    padding: 0,
    margin: 0,
  },
  image: {
    width: width,
    height: 250,
    resizeMode: 'center',
  },
  carousel: {
    maxHeight: 300,
  },
  imageBackground: {
    backgroundColor: 'black',
    minHeight: 250,
  },
  circleActive: {
    ...circleStyle,
    backgroundColor: colors.white,
  },
  circleDeactive: {
    ...circleStyle,
    backgroundColor: colors.gray,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    position: 'absolute',
    bottom: -24,
    width: '100%',
    height: 50,
    margin: 0,
  },
  noImageView: {
    backgroundColor: colors.dark_gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ImageCarousel;
