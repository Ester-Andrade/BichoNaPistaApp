import React from 'react'
import { Modal, View, Text, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import {
  useFonts,
  SourceSansPro_700Bold,
  SourceSansPro_600SemiBold,
} from '@expo-google-fonts/source-sans-pro'
import styles from './styles'
import colors from '../../config/styles'

const CustomAlert = ({ msg, onPress, showAlert, setShowAlert }) => {
  let [fontsLoaded] = useFonts({
    SourceSansPro_700Bold,
    SourceSansPro_600SemiBold,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <Modal
      visible={showAlert}
      transparent
      onRequestClose={() => setShowAlert(false)}
      animationType="slide"
      hardwareAccelerated
    >
      <View style={styles.body}>
        <View style={styles.modal}>
          <Text
            style={[styles.text, { fontFamily: 'SourceSansPro_600SemiBold' }]}
          >
            {msg}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              onPress
              setShowAlert(false)
            }}
            style={styles.btn}
          >
            <LinearGradient
              colors={[colors.darkYellow, colors.lightYellow]}
              style={styles.gradient}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
            >
              <Text
                style={{
                  color: colors.darkGray,
                  fontFamily: 'SourceSansPro_700Bold',
                  fontSize: 12,
                }}
              >
                Ok
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default CustomAlert
