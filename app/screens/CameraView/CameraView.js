import React, { useEffect, useState, useRef } from 'react'
import { View, TouchableOpacity, Alert } from 'react-native'
import { Camera, CameraType } from 'expo-camera'
import styles from './styles'

const CameraComponent = ({ setPhoto, openCamera }) => {
  const camRef = useRef(null)
  const [hasPermission, setHasPermission] = useState(null)

  useEffect(() => {
    ;(async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  if (hasPermission === null) {
    return <View />
  }

  if (hasPermission === false) {
    return Alert.alert('Ops!', 'Permissão de acesso a câmera negada.', [
      { text: 'OK', onPress: () => openCamera(false) },
    ])
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync()
      setPhoto(data)
      openCamera(false)
    }
  }

  return (
    <View style={styles.root}>
      <Camera style={{ flex: 1 }} type={CameraType.back} ref={camRef} />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={takePicture}
        style={styles.takePicture}
      />
    </View>
  )
}

export default CameraComponent
