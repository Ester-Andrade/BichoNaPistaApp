import React from 'react'
import { View, Text, TextInput } from 'react-native'
import {
  useFonts,
  SourceSansPro_600SemiBold,
} from '@expo-google-fonts/source-sans-pro'
import styles from './styles'

const CustomDivider = ({ label, style = null }) => {
  let [fontsLoaded] = useFonts({
    SourceSansPro_600SemiBold,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={[styles.root, style]}>
      <View style={styles.line} />
      <Text style={[styles.label, { fontFamily: 'SourceSansPro_600SemiBold' }]}>
        {label}
      </Text>
    </View>
  )
}

export default CustomDivider
