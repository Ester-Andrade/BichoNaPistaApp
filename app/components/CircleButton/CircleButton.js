import React from 'react'
import { Image, TouchableOpacity } from 'react-native'
import images from '../../config/images'
import styles from './styles'

const CircleButton = ({ onpress, icon, disabled = false }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onpress}
      disabled={disabled}
      style={styles['root']}
    >
      <Image
        source={images.icons[icon]}
        style={styles.image}
        resizeMode="contain"
      />
    </TouchableOpacity>
  )
}

export default CircleButton
