import React, {JSXElementConstructor, ReactElement} from 'react';
import {Pressable, PressableProps, StyleSheet, Text, View} from 'react-native';

import ProfileIcon from '../../assets/icons/profile.svg';
import ToolsIcon from '../../assets/icons/tools.svg';
import ManeuversIcon from '../../assets/icons/maneuvers.svg';
import UsersIcon from '../../assets/icons/users.svg';

import colors from '../../styles/variables';

interface NavItemProps extends PressableProps {
  icon: ReactElement<any, string | JSXElementConstructor<any>>;
  title: string;
  selected: boolean;
}

function NavItem({icon, selected, title, ...props}: NavItemProps) {
  return (
    <Pressable
      onPress={props.onPress}
      style={[
        navItemStyles.container,
        navItemStyles[selected ? 'containerSelected' : 'containerUnselected'],
      ]}>
      {React.cloneElement(icon, {
        height: selected ? 52 : 25,
        color: selected ? colors.white : colors.green_2,
      })}
      {!selected ? <Text style={navItemStyles.title}>{title}</Text> : <></>}
    </Pressable>
  );
}

const navItemStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
  },
  containerUnselected: {
    backgroundColor: colors.white,
  },
  containerSelected: {
    backgroundColor: colors.green_1,
  },
  title: {
    fontSize: 10,
    color: colors.green_2,
  },
});

interface NavbarProps {
  selected: 'Usuários' | 'Equipamentos' | 'Manobras' | 'Perfil';
  navigation: any;
}

function Navbar({selected, navigation}: NavbarProps) {
  const goToUsuarios = () => {
    console.log('usuarios');
  };

  const goToTools = () => {
    navigation.navigate('ToolList');
  };

  const goToManobras = () => {
    navigation.navigate('ManeuverList');
  };

  const goToPerfil = () => {
    console.log('perfil');
  };

  return (
    <View style={navBarStyles.container}>
      <NavItem
        onPress={() => goToUsuarios()}
        title="Usuários"
        selected={selected === 'Usuários'}
        icon={<UsersIcon />}
      />
      <NavItem
        onPress={() => goToTools()}
        title="Equipamentos"
        selected={selected === 'Equipamentos'}
        icon={<ToolsIcon />}
      />
      <NavItem
        onPress={() => goToManobras()}
        title="Manobras"
        selected={selected === 'Manobras'}
        icon={<ManeuversIcon />}
      />
      <NavItem
        onPress={() => goToPerfil()}
        title="Perfil"
        selected={selected === 'Perfil'}
        icon={<ProfileIcon />}
      />
    </View>
  );
}

const navBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 72,
    borderTopColor: colors.green_1,
    borderTopWidth: 2,
  },
});

export default Navbar;
