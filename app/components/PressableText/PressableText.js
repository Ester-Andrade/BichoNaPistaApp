import React from 'react'
import { Text, TouchableOpacity, Image } from 'react-native'
import {
  useFonts,
  SourceSansPro_400Regular,
} from '@expo-google-fonts/source-sans-pro'
import images from '../../config/images'
import scale from '../../config/HeightScale'
import styles from './styles'

const PressableText = ({
  onPress,
  text,
  size,
  type = 'normal',
  disabled = false,
  style = null,
}) => {
  let [fontsLoaded] = useFonts({
    SourceSansPro_400Regular,
  })

  if (!fontsLoaded) {
    return null
  }
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={[style, { flexDirection: 'row' }]}
      disabled={disabled}
    >
      <Image
        source={images.icons.arrow}
        style={styles['image_' + type]}
        resizeMode="contain"
      />
      <Text
        style={[
          styles['text_' + type],
          { fontFamily: 'SourceSansPro_400Regular', fontSize: size * scale },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  )
}

export default PressableText
