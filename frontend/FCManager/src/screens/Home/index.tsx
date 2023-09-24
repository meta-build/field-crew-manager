import React from 'react';
import {Pressable, Text} from 'react-native';

const Home = ({navigation}: any) => {
  return (
    <Pressable onPress={() => navigation.navigate('Profile')}>
      <Text>home</Text>
    </Pressable>
  );
};

export default Home;
