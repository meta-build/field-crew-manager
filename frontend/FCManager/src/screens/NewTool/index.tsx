import React, {useState} from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '../../styles/variables';
import Header from '../../components/Header/Index';
import InputImage from '../../components/InputImage';
import Checkbox from '../../components/Checkbox';
import InputText from '../../components/InputText';
import Dropdown from '../../components/Dropdown';
import Btn from '../../components/Button';

const {width, height} = Dimensions.get('window');

const Panel = ({children, style}: any) => {
  return <View style={[styles.panel, style]}>{children}</View>;
};

function NewTool({navigation}: any) {
  const [imgs, setImgs] = useState<string[]>([]);
  const [newType, setNewType] = useState(false);
  const [selectedTypeValue, setSelectedTypeValue] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const types = [{label: 'tipo 1', value: '123'}];
  const cities = [{label: 'sjc', value: 'sjc'}];

  const create = () => {
    console.log('criar');
  };

  const cancel = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView>
      <SafeAreaView style={styles.container}>
        <Header text="Novo Equipamento" />
        <ScrollView>
          <View style={styles.content}>
            <Panel>
              <Text style={styles.panel_label}>Fotos</Text>
              <InputImage
                onAddImage={imgsUris => {
                  const tempArr = [...imgs, ...imgsUris];
                  setImgs(tempArr);
                }}
                onRemoveImage={imgUri => {
                  const tempArr = imgs.filter(img => img !== imgUri);
                  setImgs(tempArr);
                }}
                imgs={imgs}
              />
            </Panel>
            <Panel>
              <Text style={styles.panel_label}>Tipo de equipamento</Text>
              {newType ? (
                <InputText color="gray" placeholder="Novo tipo" />
              ) : (
                <Dropdown
                  items={types}
                  placeholder="Tipo"
                  color="gray"
                  onSelect={value => setSelectedTypeValue(value)}
                />
              )}
              <Checkbox
                checked={newType}
                onPress={() => setNewType(!newType)}
                text="Novo tipo de equipamento"
              />
            </Panel>
            <Panel style={styles.fill}>
              <Text style={styles.panel_label}>Demais informações</Text>
              <View>
                <Text style={styles.label}>N° Serial</Text>
                <InputText color="gray" />
              </View>
              <View>
                <Text style={styles.label}>Cidade</Text>
                <Dropdown
                  items={cities}
                  placeholder="Escolha a cidade"
                  color="gray"
                  onSelect={value => setSelectedCity(value)}
                />
              </View>
              <View style={[styles.obsView, styles.fill]}>
                <Text style={styles.label}>Observações</Text>
                <InputText style={styles.fill} multiline color="gray" />
              </View>
            </Panel>
            <View style={styles.btnView}>
              <Btn
                onPress={() => create()}
                styleType="filled"
                title="Confirmar"
              />
              <Btn
                onPress={() => cancel()}
                styleType="outlined"
                title="Cancelar"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height: '100%',
    backgroundColor: colors.white_3,
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  content: {
    padding: 16,
    gap: 14,
    minHeight: height - 62,
    flexDirection: 'column',
  },
  panel_label: {
    fontSize: 16,
    color: colors.dark_gray,
    fontWeight: 'bold',
  },
  label: {
    color: colors.dark_gray,
    marginBottom: 4,
  },
  btnView: {
    gap: 12,
  },
  fill: {
    flex: 1,
  },
  obsView: {
    flexDirection: 'column',
  },
});

export default NewTool;
