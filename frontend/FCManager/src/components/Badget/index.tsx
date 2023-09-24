import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../styles/variables';

interface Props {
  status: 'active' | 'deactive';
  size?: 'tiny' | 'small';
}

function Badget({status, size = 'tiny'}: Props) {
  return (
    <View style={[styles.container, styles[size], styles[status]]}>
      {status === 'active' ? (
        <Text style={[styles.text, styles[`text_${size}`]]}>Ativo</Text>
      ) : (
        <Text style={[styles.text, styles[`text_${size}`]]}>Inativo</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
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
