import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import {
  useFonts,
  SourceSansPro_400Regular,
  SourceSansPro_400Regular_Italic,
  SourceSansPro_600SemiBold,
} from '@expo-google-fonts/source-sans-pro'
import images from '../../config/images'
import scale from '../../config/HeightScale'
import styles from './styles'

const CustomDropDown = ({
  data,
  placeholder,
  label = '',
  value,
  setValue,
  wShow,
  wSave,
  disabled = false,
  touched = () => null,
  optional = false,
  style = null,
}) => {
  const [clicked, setClicked] = useState(false)

  let [fontsLoaded] = useFonts({
    SourceSansPro_400Regular,
    SourceSansPro_400Regular_Italic,
    SourceSansPro_600SemiBold,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={[styles.root, style]}>
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.field}
        onPress={() => {
          disabled ? null : setClicked(!clicked)
          clicked ? touched() : null
        }}
      >
        {(value !== null && label !== '') || placeholder === '' ? (
          <Text
            style={[styles.label, { fontFamily: 'SourceSansPro_400Regular' }]}
          >
            {label}
          </Text>
        ) : null}
        <Text style={[styles.text, { fontFamily: 'SourceSansPro_400Regular' }]}>
          {value === null
            ? placeholder
            : data[data.map((item) => item[wSave]).indexOf(value)][wShow]}
        </Text>
        {clicked ? (
          <Image
            source={images.icons.arrow}
            style={[styles.image, { transform: [{ rotate: '180deg' }] }]}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={images.icons.arrow}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
      {clicked ? (
        <View
          style={[
            styles.dropDown,
            data.length === 2 ? { height: 99 * scale } : null,
          ]}
        >
          <ScrollView nestedScrollEnabled={true}>
            {data.map((item, key) => (
              <TouchableOpacity
                key={key}
                style={styles.dropDownItem}
                onPress={() => {
                  setValue(item[wSave])
                  setClicked(!clicked)
                }}
              >
                <Text
                  style={[
                    styles.text,
                    { fontFamily: 'SourceSansPro_600SemiBold' },
                  ]}
                >
                  {item[wShow]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : optional ? (
        <Text
          style={[
            styles.optional,
            { fontFamily: 'SourceSansPro_400Regular_Italic' },
          ]}
        >
          Opcional
        </Text>
      ) : null}
    </View>
  )
}

export default CustomDropDown
