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
        // navItemStyles[selected ? 'containerSelected' : 'containerUnselected'],
      ]}>
      {React.cloneElement(icon, {
        height: 25,
        color: selected ? colors.green_1 : colors.gray_2,
      })}
      <Text
        style={[
          navItemStyles.title,
          navItemStyles[selected ? 'titleSelected' : 'titleUnselected'],
        ]}>
        {title}
      </Text>
    </Pressable>
  );
}

const navItemStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
    // backgroundColor: colors.white,
  },
  title: {
    fontSize: 10,
  },
  titleSelected: {
    color: colors.green_1,
  },
  titleUnselected: {
    color: colors.gray_2,
  },
});

interface NavbarProps {
  selected: 'Usuários' | 'Equipamentos' | 'Manobras' | 'Perfil';
  navigation: any;
}

function Navbar({selected, navigation}: NavbarProps) {
  const goToUsuarios = () => {
    navigation.navigate('UserList');
  };

  const goToTools = () => {
    navigation.navigate('ToolList');
  };

  const goToManobras = () => {
    console.log('manobras');
  };

  const goToPerfil = () => {
    navigation.navigate('OwnUserProfile');
  };

  return (
    <>
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
    </>
  );
}

const navBarStyles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    height: 72,
    elevation: 1,
    backgroundColor: colors.white,
    borderTopColor: colors.white_2,
    borderTopWidth: 2,
  },
});

export default Navbar;
