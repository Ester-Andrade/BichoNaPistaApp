import React from 'react'
import { Image, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useHeaderHeight } from '@react-navigation/elements'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import colors from '../../config/styles'
import images from '../../config/images'
import styles from './styles'

const CustomHeader = ({ hasLogo = true }) => {
  const insets = useSafeAreaInsets()
  const headerHeight = useHeaderHeight() - insets.top

  return (
    <View
      style={{
        width: '100%',
        height: useHeaderHeight(),
        backgroundColor: colors.yellow,
      }}
    >
      <LinearGradient
        colors={[colors.darkYellow, colors.yellow]}
        style={[
          styles.root,
          {
            marginTop: insets.top,
            height: headerHeight,
          },
        ]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
      >
        {hasLogo ? (
          <Image
            source={images.miniLogo}
            style={[styles.logo, { width: headerHeight * 0.8 }]}
          />
        ) : null}
      </LinearGradient>
    </View>
  )
}

export default CustomHeader
