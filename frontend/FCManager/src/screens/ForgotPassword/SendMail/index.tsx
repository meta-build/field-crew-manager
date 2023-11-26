import React from 'react';
import {Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import useContexto from '../../../hooks/useContexto';
import colors from '../../../styles/variables';

function SendMail({navigate}: any) {
  const {tempMail} = useContexto();

  return (
    <SafeAreaView>
      <Text style={{color: colors.dark_gray}}>{tempMail}</Text>
    </SafeAreaView>
  );
}

export default SendMail;
