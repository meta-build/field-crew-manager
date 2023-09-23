import React, {useState} from 'react';
import {
  FlatList,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '../../styles/variables';
import ArrowDown from '../../assets/icons/arrowDown.svg';
import ArrowUp from '../../assets/icons/arrowUp.svg';

interface PropsItem extends PressableProps {
  label: string;
}

function DropdownItem({label, ...props}: PropsItem) {
  const [clicked, setClicked] = useState(false);

  const stylesItem = StyleSheet.create({
    background: {
      backgroundColor: clicked ? colors.white_4 : 'transparent',
    },
  });

  return (
    <Pressable
      style={[styles.item, stylesItem.background]}
      onPress={props.onPress}
      onPressIn={() => setClicked(true)}
      onPressOut={() => setClicked(false)}>
      <Text style={styles.itemText}>{label}</Text>
    </Pressable>
  );
}

interface Props {
  items: {label: string; value: string}[];
  placeholder: string;
  onSelect: (value: string) => void;
}

function Dropdown({items, placeholder, onSelect}: Props) {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');

  const onItemSelect = (item: {value: string; label: string}) => {
    setSelectedLabel(item.label);
    onSelect(item.value);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => setOpen(!open)}>
        <Text
          style={[
            styles.buttonText,
            !selectedLabel && styles.buttonPlaceholder,
          ]}>
          {selectedLabel || placeholder}
        </Text>
        {open ? (
          <ArrowUp style={styles.buttonIcon} width={14} height={14} />
        ) : (
          <ArrowDown style={styles.buttonIcon} width={14} height={14} />
        )}
      </Pressable>

      {open && (
        <FlatList
          style={styles.list}
          data={items}
          renderItem={item => (
            <DropdownItem
              label={item.item.label}
              onPress={() => onItemSelect(item.item)}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    backgroundColor: colors.white,
    padding: 8,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.dark_gray,
    flex: 1,
    marginRight: 16,
  },
  buttonPlaceholder: {
    color: colors.light_gray_2,
    flex: 1,
    marginRight: 16,
  },
  buttonIcon: {
    marginRight: 4,
  },
  list: {
    width: '100%',
    marginTop: 6,
    paddingVertical: 4,
    backgroundColor: colors.white,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 300,
  },
  item: {
    paddingVertical: 2,
    backgroundColor: 'red',
  },
  itemText: {
    color: colors.dark_gray,
    marginLeft: 8,
  },
});

export default Dropdown;
