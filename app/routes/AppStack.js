import React, { useContext } from 'react'
import { View, Text, Image, Alert } from 'react-native'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthContext } from '../context/Auth'
import { MonitoringContext } from '../context/Monitoring'
import HomeScreen from '../screens/HomeScreen'
import RegistrationScreen from '../screens/RegistrationScreen'
import MonitoringScreen from '../screens/MonitoringScreen'
import MyRegistrationsScreen from '../screens/MyRegistrationsScreen'
import RankingScreen from '../screens/RankingScreen'
import ComplementDestinationScreen from '../screens/ComplementDestinationScreen'
import images from '../config/images'
import colors from '../config/styles'

const Drawer = createDrawerNavigator()
const Stack = createNativeStackNavigator()

const CustomDrawerContent = (props) => {
  const { userName, userType, logOut } = useContext(AuthContext)
  const { inMonitoring, finished, clearMonitoringVar } =
    useContext(MonitoringContext)

  const { state, ...rest } = props
  const newState = { ...state }
  newState.routes = newState.routes.filter((item) => item.name !== 'Home')

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList state={newState} {...rest} />
        <View
          style={{
            width: '94%',
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 9,
            paddingVertical: 17,
            marginBottom: 7,
            borderBottomWidth: 1.5,
            borderBottomColor: '#D9D9D9',
          }}
        >
          <View
            style={{
              height: 66,
              width: 66,
              borderRadius: 1000,
              backgroundColor: colors.gray4,
            }}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: 'SourceSansPro_700Bold',
                fontSize: 19,
                // lineHeight: 19,
                color: colors.darkGray2,
              }}
            >
              {userName}
            </Text>
            <Text
              style={{
                marginTop: -5,
                fontFamily: 'SourceSansPro_400Regular_Italic',
                fontSize: 13,
                color: colors.darkGray2,
              }}
            >
              Posição no ranking: 12º
            </Text>
            <Text
              style={{
                marginTop: -3,
                fontFamily: 'SourceSansPro_400Regular_Italic',
                fontSize: 13,
                color: colors.darkGray2,
              }}
            >
              Registros enviados: 50
            </Text>
          </View>
        </View>
        <DrawerItem
          label="Monitoramento"
          icon={() => (
            <Image
              source={images.icons.tracking}
              style={{
                height: 21,
                width: 21,
                marginLeft: 9,
                opacity: userType === 1 ? 1 : 0.55,
              }}
              resizeMode="contain"
            />
          )}
          onPress={() =>
            userType === 1 ? props.navigation.navigate('Monitoramento') : null
          }
          labelStyle={{
            marginLeft: -16,
            alignItems: 'baseline',
            fontFamily: 'SourceSansPro_400Regular',
            fontSize: 17,
            color: userType === 1 ? colors.darkGray2 : colors.gray,
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
              }}
              resizeMode="contain"
            />
          )}
          onPress={() => props.navigation.navigate('Meus Registros')}
          labelStyle={{
            marginLeft: -17,
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
          label="Ranking"
          icon={() => (
            <Image
              source={images.icons.trofeo}
              style={{
                height: 21,
                width: 21,
                marginLeft: 9,
              }}
              resizeMode="contain"
            />
          )}
          onPress={() => props.navigation.navigate('Ranking')}
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
                opacity: userType === 1 ? 1 : 0.55,
              }}
              resizeMode="contain"
            />
          )}
          onPress={() =>
            userType === 1
              ? props.navigation.navigate('Complementar destino')
              : null
          }
          labelStyle={{
            marginLeft: -16,
            marginRight: -32,
            alignItems: 'baseline',
            fontFamily: 'SourceSansPro_400Regular',
            fontSize: 17,
            color: userType === 1 ? colors.darkGray2 : colors.gray,
          }}
          style={{
            alignSelf: 'center',
            width: '94%',
          }}
          pressColor={colors.yellow}
        />
      </DrawerContentScrollView>
      <DrawerItem
        label="Sair"
        icon={() => (
          <Image
            source={images.icons.logOut}
            style={{
              height: 21,
              width: 21,
              marginLeft: 9,
            }}
            resizeMode="contain"
          />
        )}
        onPress={() => {
          inMonitoring || finished
            ? Alert.alert(
                'Monitoramento em andamento!',
                'Existe um monitoramento em andamento, ou não enviado, sair da sua conta irá cancelar o monitoramento em questão. \n Tem certeza que deseja sair ?',
                [
                  {
                    text: 'Sim',
                    onPress: () => {
                      clearMonitoringVar()
                      logOut()
                    },
                  },
                  { text: 'Não', onPress: () => null },
                ]
              )
            : logOut()
        }}
        labelStyle={{
          marginLeft: -16,
          alignItems: 'baseline',
          fontFamily: 'SourceSansPro_400Regular',
          fontSize: 17,
          color: colors.darkGray2,
        }}
        style={{
          alignSelf: 'center',
          height: 60,
          justifyContent: 'center',
          borderTopWidth: 1.5,
          borderTopColor: '#D9D9D9',
          width: '94%',
        }}
        pressColor={colors.ligthGray}
      />
    </View>
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
          headerTitleAlign: 'center',
        }}
      />
    </Drawer.Navigator>
  )
}

export default function AppStack() {
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
        name="Monitoramento"
        component={MonitoringScreen}
        options={{
          headerTransparent: true,
          title: '',
        }}
      />
      <Stack.Screen
        name="Meus Registros"
        component={MyRegistrationsScreen}
        options={{
          headerTransparent: true,
          title: '',
        }}
      />
      <Stack.Screen
        name="Ranking"
        component={RankingScreen}
        options={{
          headerTransparent: true,
          title: '',
        }}
      />
      <Stack.Screen
        name="Complementar destino"
        component={ComplementDestinationScreen}
        options={{
          headerTransparent: true,
          title: '',
        }}
      />
    </Stack.Navigator>
  )
}
