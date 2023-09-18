import React from 'react';
import {useState} from 'react';
import {
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TextInputChangeEventData,
} from 'react-native';

const InputText = () => {
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
        style={styles.inputgray}
        placeholder="Pesquisar por tipo..."
        placeholderTextColor="gray"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputgray: {
    backgroundColor: '#BFBFBF',
    color: 'black',
    borderRadius: 10,
  },
});

export default InputText;
