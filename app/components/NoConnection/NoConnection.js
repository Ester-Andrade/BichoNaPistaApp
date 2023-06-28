import React from 'react'
import { View, Text } from 'react-native'
import {
  useFonts,
  SourceSansPro_400Regular,
} from '@expo-google-fonts/source-sans-pro'
import { useHeaderHeight } from '@react-navigation/elements'
import styles from './styles'

const NoConnection = () => {
  const headerHeight = useHeaderHeight()

  let [fontsLoaded] = useFonts({
    SourceSansPro_400Regular,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={[styles.root, { marginTop: headerHeight }]}>
      <Text
        style={[
          styles.noConnectionText,
          { fontFamily: 'SourceSansPro_400Regular' },
        ]}
      >
        sem conexão com a internet.
      </Text>
    </View>
  )
}

export default NoConnection
