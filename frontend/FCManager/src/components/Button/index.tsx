import React, {FunctionComponent} from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
} from 'react-native';
import colors from '../../styles/variables';
import {SvgProps} from 'react-native-svg';

interface Props extends PressableProps {
  styleType: 'filled' | 'outlined' | 'blank' | 'alert';
  enable?: boolean;
  title?: string;
  icon?: FunctionComponent<SvgProps>;
  loading?: boolean;
}

const Btn = ({
  icon,
  title,
  enable = true,
  styleType,
  loading = false,
  ...props
}: Props) => {
  const styles = StyleSheet.create({
    btn: {
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
    },
    filled: {
      backgroundColor: enable ? colors.green_1 : colors.green_3,
    },
    outlined: {
      padding: 10,
      backgroundColor: enable ? colors.white : colors.light_gray_1,
      borderColor: enable ? colors.green_1 : colors.green_3,
      borderWidth: 2,
    },
    blank: {
      backgroundColor: enable ? colors.white : colors.white_2,
    },
    alert: {
      backgroundColor: enable ? colors.alert_1 : colors.alert_3,
    },
    text: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    text_filled: {color: enable ? colors.white : colors.light_gray_1},
    text_outlined: {color: enable ? colors.green_1 : colors.green_3},
    text_blank: {color: enable ? colors.green_1 : colors.green_3},
    text_alert: {color: enable ? colors.white : colors.light_gray_1},
  });

  const contentMiddleware = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size={20}
          color={
            styleType === 'filled' || styleType === 'alert'
              ? colors.white
              : colors.green_1
          }
        />
      );
    }
    if (!title) {
      if (!icon) {
        return <></>;
      }
      return <>{icon}</>;
    }
    return (
      <Text style={[styles.text, styles[`text_${styleType}`]]}>{title}</Text>
    );
  };

  return (
    <Pressable
      disabled={!enable}
      onPress={props.onPress}
      style={[styles.btn, styles[styleType]]}>
      {contentMiddleware()}
    </Pressable>
  );
};

export default Btn;
