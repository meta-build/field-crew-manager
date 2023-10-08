import React from 'react';
import {StyleSheet, Text} from 'react-native';
import colors from '../../styles/variables';

interface Props {
  status: 'active' | 'deactive';
  size?: 'tiny' | 'small';
  customText?: string;
}

function Badget({status, size = 'tiny', customText}: Props) {
  return (
    <>
      {status === 'active' ? (
        <Text
          style={[
            styles.container,
            styles[size],
            styles[status],
            styles.text,
            styles[`text_${size}`],
          ]}>
          {customText ? customText : 'Ativo'}
        </Text>
      ) : (
        <Text
          style={[
            styles.container,
            styles[size],
            styles[status],
            styles.text,
            styles[`text_${size}`],
          ]}>
          {customText ? customText : 'Inativo'}
        </Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    textAlign: 'center',
    borderRadius: 12,
    width: 'auto',
  },
  tiny: {
    padding: 6,
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  active: {
    backgroundColor: colors.green_1,
  },
  deactive: {
    backgroundColor: colors.gray,
  },
  text: {
    color: colors.white,
  },
  text_tiny: {
    fontSize: 10,
  },
  text_small: {
    fontSize: 12,
  },
});

export default Badget;
