import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
} from 'react-native';
import colors from '../../styles/variables';

interface Props extends TextInputProps {
  color: 'gray' | 'white';
  enable?: boolean;
  style?: StyleProp<TextStyle>;
}

const InputText = ({enable = true, color, ...props}: Props) => {
  const inputStyles = {
    borderRadius: 10,
    padding: 6,
    color: colors.dark_gray,
  };

  const styles = StyleSheet.create({
    gray: {
      ...inputStyles,
      backgroundColor: colors.white_2,
      ...(!enable ? {backgroundColor: colors.white_3} : {}),
    },
    white: {
      ...inputStyles,
      backgroundColor: colors.white,
      ...(!enable ? {backgroundColor: colors.white_4} : {}),
    },
  });

  return (
    <TextInput
      style={[styles[color], props.style]}
      placeholderTextColor={colors.light_gray_2}
      onChange={props.onChange}
      value={props.value}
      placeholder={props.placeholder}
      editable={enable}
      multiline={props.multiline}
      textAlignVertical={props.textAlignVertical}
    />
  );
};

export default InputText;
