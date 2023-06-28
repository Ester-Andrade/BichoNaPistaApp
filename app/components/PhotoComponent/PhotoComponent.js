import React from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import images from '../../config/images'
import styles from './styles'

const PhotoComponent = ({ photo, setPhoto, onPress, disabled }) => {
  return (
    <View style={styles.root}>
      {photo !== null ? (
        <View>
          <Image source={{ uri: photo }} style={styles.image} />
          {disabled ? null : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setPhoto(null)}
              style={styles.removeBtn}
            >
              <Image source={images.icons.removeCircle} style={styles.image} />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPress}
          disabled={disabled}
          style={styles.tochableArea}
        >
          <Image
            source={images.icons.addPhoto}
            style={styles.addPhoto}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default PhotoComponent
