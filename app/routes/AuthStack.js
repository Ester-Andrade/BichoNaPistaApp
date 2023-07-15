import React from 'react'
import { Image } from 'react-native'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import LoginScreen from '../screens/LoginScreen'
import RegistrationScreen from '../screens/RegistrationScreen'
import images from '../config/images'
import colors from '../config/styles'

const Drawer = createDrawerNavigator()
const Stack = createNativeStackNavigator()

const CustomDrawerContent = (props) => {
  const { state, ...rest } = props
  const newState = { ...state }
  newState.routes = newState.routes.filter((item) => item.name !== 'Home')

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList state={newState} {...rest} />
      <DrawerItem
        label="Login"
        icon={() => (
          <Image
            source={images.icons.account}
            style={{
              height: 21,
              width: 21,
              marginLeft: 9,
            }}
            resizeMode="contain"
          />
        )}
        onPress={() => props.navigation.navigate('Login')}
        labelStyle={{
          marginLeft: -16,
          alignItems: 'baseline',
          fontFamily: 'SourceSansPro_400Regular',
          fontSize: 17,
          color: colors.darkGray2,
        }}
        style={{
          alignSelf: 'center',
          width: '94%',
        }}
        pressColor={colors.yellow}
      />
      <DrawerItem
        label="Monitoramento"
        icon={() => (
          <Image
            source={images.icons.tracking}
            style={{
              height: 21,
              width: 21,
              marginLeft: 9,
              opacity: 0.55,
            }}
            resizeMode="contain"
          />
        )}
        onPress={() => null}
        labelStyle={{
          marginLeft: -16,
          alignItems: 'baseline',
          fontFamily: 'SourceSansPro_400Regular',
          fontSize: 17,
          color: colors.gray,
        }}
        style={{
          alignSelf: 'center',
          width: '94%',
        }}
        pressColor={colors.yellow}
      />
      <DrawerItem
        label="Meus registros"
        icon={() => (
          <Image
            source={images.icons.list}
            style={{
              height: 21,
              width: 22,
              marginLeft: 9,
              opacity: 0.55,
            }}
            resizeMode="contain"
          />
        )}
        onPress={() => null}
        labelStyle={{
          marginLeft: -17,
          alignItems: 'baseline',
          fontFamily: 'SourceSansPro_400Regular',
          fontSize: 17,
          color: colors.gray,
        }}
        style={{
          alignSelf: 'center',
          width: '94%',
        }}
        pressColor={colors.yellow}
      />
      <DrawerItem
        label="Ranking"
        icon={() => (
          <Image
            source={images.icons.trofeo}
            style={{
              height: 21,
              width: 21,
              marginLeft: 9,
              opacity: 0.55,
            }}
            resizeMode="contain"
          />
        )}
        onPress={() => null}
        labelStyle={{
          marginLeft: -16,
          alignItems: 'baseline',
          fontFamily: 'SourceSansPro_400Regular',
          fontSize: 17,
          color: colors.gray,
        }}
        style={{
          alignSelf: 'center',
          width: '94%',
        }}
        pressColor={colors.yellow}
      />
      <DrawerItem
        label="Complementar destino do animal"
        icon={() => (
          <Image
            source={images.icons.edit}
            style={{
              height: 21,
              width: 21,
              alignSelf: 'flex-start',
              marginLeft: 9,
              marginTop: 7,
              opacity: 0.55,
            }}
            resizeMode="contain"
          />
        )}
        onPress={() => null}
        labelStyle={{
          marginLeft: -16,
          marginRight: -32,
          alignItems: 'baseline',
          fontFamily: 'SourceSansPro_400Regular',
          fontSize: 17,
          color: colors.gray,
        }}
        style={{
          alignSelf: 'center',
          width: '94%',
        }}
        pressColor={colors.yellow}
      />
    </DrawerContentScrollView>
  )
}

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      defaultStatus="closed"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: colors.ligthGray,
          borderTopRightRadius: 15,
          borderBottomRightRadius: 15,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTransparent: true,
          title: 'BICHO NA PISTA',
          headerTintColor: colors.darkGray,
          headerTitleStyle: {
            fontFamily: 'Alata_400Regular',
          },
          headerTitleAlign: 'center'
        }}
      />
    </Drawer.Navigator>
  )
}

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="root"
      screenOptions={{ headerTintColor: colors.darkGray }}
    >
      <Stack.Screen
        name="root"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Registro"
        component={RegistrationScreen}
        options={{
          headerTransparent: true,
          title: '',
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerTransparent: true,
          title: '',
        }}
      />
    </Stack.Navigator>
  )
}
