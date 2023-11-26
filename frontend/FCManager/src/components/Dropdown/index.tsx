import React, {useState} from 'react';
import {Pressable, PressableProps, StyleSheet, Text, View} from 'react-native';
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
  onSelect: (value: string, label: string) => void;
  enable?: boolean;
  color?: 'white' | 'gray';
  value?: string;
}

function Dropdown({
  items,
  placeholder,
  onSelect,
  enable = true,
  color = 'white',
  value,
}: Props) {
  const [open, setOpen] = useState(false);

  const onItemSelect = (item: {value: string; label: string}) => {
    onSelect(item.value, item.label);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        disabled={!enable}
        style={[
          styles.button,
          color === 'gray' ? {backgroundColor: colors.white_2} : {},
          !enable ? {backgroundColor: colors.light_gray_2} : {},
        ]}
        onPress={() => setOpen(!open)}>
        <Text style={styles.buttonText}>
          {items.find(option => option.value === value)?.label || placeholder}
        </Text>
        {open ? (
          <ArrowUp style={styles.buttonIcon} width={14} height={14} />
        ) : (
          <ArrowDown style={styles.buttonIcon} width={14} height={14} />
        )}
      </Pressable>

      {open && (
        <View
          style={[
            styles.list,
            color === 'gray' ? {backgroundColor: colors.white_2} : {},
          ]}>
          {items.map((item, index) => (
            <DropdownItem
              key={index.toString()}
              label={item.label}
              onPress={() => onItemSelect(item)}
            />
          ))}
        </View>
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
