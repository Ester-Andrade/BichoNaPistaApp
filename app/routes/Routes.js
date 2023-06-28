import React, { useContext } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { useFonts, Alata_400Regular } from '@expo-google-fonts/alata'
import {
  SourceSansPro_400Regular,
  SourceSansPro_700Bold,
  SourceSansPro_400Regular_Italic,
} from '@expo-google-fonts/source-sans-pro'
import { AuthContext } from '../context/Auth'
import AuthStack from './AuthStack'
import AppStack from './AppStack'
import colors from '../config/styles'

export default function Router() {
  const { isLoading, userToken } = useContext(AuthContext)

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} color={colors.yellow} />
      </View>
    )
  }

  let [fontsLoaded] = useFonts({
    Alata_400Regular,
    SourceSansPro_400Regular,
    SourceSansPro_700Bold,
    SourceSansPro_400Regular_Italic,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <NavigationContainer>
      {userToken !== null ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  )
}
