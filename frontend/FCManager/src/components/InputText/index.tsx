import React from 'react';
import {useState} from 'react';
import {
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TextInputChangeEventData,
} from 'react-native';
import colors from '../../styles/variables';

interface Props {
  color: 'gray' | 'white';
}

const InputText = (props: Props) => {
  const [value, Setvalue] = useState<string>('');
  const handleOnChangeInput = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
  ) => {
    Setvalue(event.nativeEvent.text);
  };

  return (
    <SafeAreaView>
      <TextInput
        onChange={handleOnChangeInput}
        value={value}
        style={styles[props.color]}
        placeholder="Pesquisar por tipo..."
        placeholderTextColor={colors.light_gray_2}
      />
    </SafeAreaView>
  );
};

const inputStyles = {
  borderRadius: 10,
  padding: 12,
  color: colors.dark_gray,
};

const styles = StyleSheet.create({
  gray: {
    ...inputStyles,
    backgroundColor: colors.white_2,
  },
  white: {
    ...inputStyles,
    backgroundColor: colors.white,
  },
});

export default InputText;
