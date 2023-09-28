import React from 'react';
import {
  Image,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Badget from '../Badget';
import ArrowRight from '../../assets/icons/arrowRightGreen.svg';
import colors from '../../styles/variables';

interface Props extends PressableProps {
  tool: {
    tipoLabel: string;
    img_uri: string;
    n_serie: string;
    status: 'active' | 'deactive';
  };
}

function ToolItem({tool, ...props}: Props) {
  return (
    <Pressable
      style={styles.container}
      onPress={props.onPress}
      onPressIn={props.onPressIn}
      onPressOut={props.onPressOut}
      onLongPress={props.onLongPress}>
      <Image
        style={styles.img}
        source={{
          uri: tool.img_uri,
        }}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{tool.tipoLabel}</Text>
        <View style={styles.value_label}>
          <Text style={[styles.desc, styles.label]}>N° Série:</Text>
          <Text style={styles.desc}>{tool.n_serie}</Text>
        </View>
        <View style={styles.badge}>
          <Badget status={tool.status} size="tiny" />
        </View>
      </View>
      <ArrowRight style={styles.arrow} width={10} height={15} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: 90,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
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
  badge: {
    width: 48,
  },
  arrow: {
    marginRight: 12,
  },
});

export default ToolItem;
