import React, {JSXElementConstructor, ReactElement} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import ProfileIcon from '../../assets/icons/profile.svg';
import ToolsIcon from '../../assets/icons/tools.svg';
import ManeuversIcon from '../../assets/icons/maneuvers.svg';
import UsersIcon from '../../assets/icons/users.svg';

import colors from '../../styles/variables';

interface NavItemProps {
  icon: ReactElement<any, string | JSXElementConstructor<any>>;
  title: string;
  selected: boolean;
}

function NavItem({icon, selected, title}: NavItemProps) {
  return (
    <View
      style={[
        navItemStyles.container,
        navItemStyles[selected ? 'containerSelected' : 'containerUnselected'],
      ]}>
      {React.cloneElement(icon, {
        height: selected ? 52 : 25,
        color: selected ? colors.white : colors.green_2,
      })}
      {!selected ? <Text style={navItemStyles.title}>{title}</Text> : <></>}
    </View>
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
}

function Navbar({selected}: NavbarProps) {
  return (
    <View style={navBarStyles.container}>
      <NavItem
        title="Usuários"
        selected={selected === 'Usuários'}
        icon={<UsersIcon />}
      />
      <NavItem
        title="Equipamentos"
        selected={selected === 'Equipamentos'}
        icon={<ToolsIcon />}
      />
      <NavItem
        title="Manobras"
        selected={selected === 'Manobras'}
        icon={<ManeuversIcon />}
      />
      <NavItem
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
  },
});

export default Navbar;
