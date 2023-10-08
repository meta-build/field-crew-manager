import React from 'react';
import {Pressable, PressableProps, StyleSheet, Text, View} from 'react-native';

import Badget from '../Badget';

import ArrowRight from '../../assets/icons/arrowRightGreen.svg';
import CheckboxIcon from '../../assets/icons/box.svg';
import CheckedboxIcon from '../../assets/icons/filledBoxChecked.svg';

import colors from '../../styles/variables';

interface Props extends PressableProps {
  maneuver: {
    title: string;
    user: string;
    status: 'active' | 'deactive';
    date?: string;
  };
  checkbox?: boolean;
  checked?: boolean;
  highlight?: boolean;
}

function ManeuverItem({maneuver, ...props}: Props) {
  const convertBadgeText = () => {
    if (maneuver.status === 'active') {
      return 'Ativo';
    } else {
      const text = `Finalizado em ${new Date(
        maneuver.date as string,
      ).toLocaleDateString('pt-BR')} às ${new Date(
        maneuver.date as string,
      ).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
      return text;
    }
  };

  return (
    <Pressable
      style={[styles.container, props.highlight && styles.highlightContainer]}
      onPress={props.onPress}
      onPressIn={props.onPressIn}
      onPressOut={props.onPressOut}
      onLongPress={props.onLongPress}>
      <View style={styles.info}>
        <Text style={[styles.title, props.highlight && styles.highlightText]}>
          {maneuver.title}
        </Text>
        <View style={styles.value_label}>
          <Text style={[styles.desc, props.highlight && styles.highlightText]}>
            por
          </Text>
          <Text
            style={[
              styles.desc,
              styles.label,
              props.highlight && styles.highlightText,
            ]}>
            {maneuver.user}
          </Text>
        </View>
        <View style={styles.badgeView}>
          <Badget
            status={maneuver.status}
            size="tiny"
            customText={convertBadgeText()}
          />
        </View>
      </View>
      {!props.checkbox ? (
        <ArrowRight width={10} height={15} />
      ) : !props.checked ? (
        <CheckboxIcon width={16} height={16} />
      ) : (
        <CheckedboxIcon width={16} height={16} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    minHeight: 90,
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 12,
    gap: 12,
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  highlightContainer: {
    borderColor: colors.green_1,
    borderWidth: 2,
  },
  highlightText: {
    color: colors.green_2,
  },
  info: {
    flex: 1,
    gap: 6,
    paddingVertical: 4,
  },
  value_label: {
    flexDirection: 'row',
    gap: 4,
  },
  img: {
    width: 84,
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    color: colors.dark_gray,
    fontSize: 16,
    fontWeight: 'bold',
  },
  desc: {
    color: colors.dark_gray,
    fontSize: 12,
  },
  label: {
    fontWeight: 'bold',
  },
  badgeView: {
    alignSelf: 'flex-start',
  },
});

export default ManeuverItem;
