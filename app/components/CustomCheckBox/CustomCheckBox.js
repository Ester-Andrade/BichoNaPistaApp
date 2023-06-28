import React, { useState } from 'react'
import { View, Text } from 'react-native'
import {
  useFonts,
  SourceSansPro_400Regular,
} from '@expo-google-fonts/source-sans-pro'
import Checkbox from 'expo-checkbox'
import styles from './styles'

const CustomCheckBox = ({
  data,
  label,
  value,
  setValue,
  wShow,
  wSave,
  disabled = false,
  optional,
  style = null,
  nextTouched,
  errors,
}) => {
  const [isChecked, setIsChecked] = useState(
    Array.from({ length: data.length }, () => false)
  )

  if (value.length !== 0) {
    let vect = isChecked
    value.map((v) => {
      vect[data.map((item) => item[wSave]).indexOf(v)] = true
    })
  }

  let [fontsLoaded] = useFonts({
    SourceSansPro_400Regular,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={[styles.root, style]}>
      <Text style={[styles.label, { fontFamily: 'SourceSansPro_400Regular' }]}>
        {label}
      </Text>
      {optional ? (
        <Text
          style={[
            styles.optional,
            { fontFamily: 'SourceSansPro_400Regular_Italic' },
          ]}
        >
          Opcional
        </Text>
      ) : null}
      {nextTouched && errors && (
        <Text
          style={[
            styles.errors,
            { fontFamily: 'SourceSansPro_400Regular_Italic' },
          ]}
        >
          {errors}
        </Text>
      )}
      {data.map((item, key) => (
        <View style={styles.checkBoxContainer} key={key}>
          <Checkbox
            value={isChecked[key]}
            onValueChange={() => {
              setIsChecked(
                isChecked.map((v, i) => {
                  return i === key ? !v : v
                })
              )
              setValue(
                value.includes(item[wSave])
                  ? value.filter((v) => v !== item[wSave])
                  : [...value, item[wSave]]
              )
            }}
            style={styles.checkBox}
            disabled={disabled}
            color={isChecked[key] ? '#FFD333' : '#8C8C8C'}
          />
          <Text
            style={[styles.text, { fontFamily: 'SourceSansPro_400Regular' }]}
          >
            {item[wShow]}
          </Text>
        </View>
      ))}
    </View>
  )
}

export default CustomCheckBox
