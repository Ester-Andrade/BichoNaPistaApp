import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import {
  useFonts,
  SourceSansPro_700Bold,
} from '@expo-google-fonts/source-sans-pro'
import styles from './styles'
import colors from '../../config/styles'
import scale from '../../config/HeightScale'

const CustomButton = ({ onPress, title, disabled = false, style = null }) => {
  initialColor = colors.darkYellow
  finalColor = colors.lightYellow

  let [fontsLoaded] = useFonts({
    SourceSansPro_700Bold,
  })

  if (!fontsLoaded) {
    return null
  }

  if (disabled) {
    initialColor = '#A6A6A6'
    finalColor = '#D9D9D9'
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={[styles.root, style]}
    >
      <LinearGradient
        colors={[initialColor, finalColor]}
        style={styles.gradient}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
      >
        <Text
          style={{
            color: colors.darkGray,
            fontFamily: 'SourceSansPro_700Bold',
            fontSize: 15 * scale,
          }}
        >
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}

export default CustomButton
