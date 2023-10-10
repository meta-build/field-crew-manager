import React, {useState} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';

import colors from '../../styles/variables';

import EyeIcon from '../../assets/icons/eye.svg';
import ClosedEyeIcon from '../../assets/icons/closedEye.svg';

interface Props extends TextInputProps {
  color: 'gray' | 'white';
  enable?: boolean;
  style?: StyleProp<TextStyle>;
  error?: boolean;
  isPassword?: boolean;
}

const EyeComponent = ({
  open,
  onPress,
}: {
  open: boolean;
  onPress: () => void;
}) => {
  const stylesEyeComponent = StyleSheet.create({
    pressable: {
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <Pressable style={stylesEyeComponent.pressable} onPress={() => onPress()}>
      {React.cloneElement(open ? <EyeIcon /> : <ClosedEyeIcon />, {
        width: 20,
        color: colors.dark_gray,
      })}
    </Pressable>
  );
};

const InputText = ({enable = true, color, ...props}: Props) => {
  const [hideText, setHideText] = useState(true);

  const styles = StyleSheet.create({
    input: {
      color: colors.dark_gray,
      padding: 0,
      flex: 1,
      alignSelf: 'stretch',
    },
    gray: {
      borderRadius: 10,
      padding: 6,
      backgroundColor: colors.white_2,
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: 8,
      ...(props.error ? {borderColor: colors.alert_1, borderWidth: 1} : {}),
      ...(!enable ? {backgroundColor: colors.white_3} : {}),
    },
    white: {
      borderRadius: 10,
      padding: 6,
      backgroundColor: colors.white,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      ...(props.error ? {borderColor: colors.alert_1, borderWidth: 1} : {}),
      ...(!enable ? {backgroundColor: colors.white_4} : {}),
    },
  });

  return (
    <View style={[styles[color], props.style]}>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.light_gray_2}
        onChange={props.onChange}
        value={props.value}
        placeholder={props.placeholder}
        editable={enable}
        multiline={props.multiline}
        textAlignVertical={props.textAlignVertical}
        secureTextEntry={props.isPassword ? hideText : false}
      />
      {props.isPassword ? (
        <EyeComponent open={!hideText} onPress={() => setHideText(!hideText)} />
      ) : (
        <></>
      )}
    </View>
  );
};

export default InputText;
