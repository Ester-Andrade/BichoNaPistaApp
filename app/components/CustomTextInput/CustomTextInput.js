import React from 'react'
import { View, Text, TextInput } from 'react-native'
import {
  useFonts,
  SourceSansPro_400Regular,
  SourceSansPro_400Regular_Italic,
} from '@expo-google-fonts/source-sans-pro'
import styles from './styles'

const CustomTextInput = ({
  placeholder = '',
  label = '',
  value,
  setValue,
  editable = true,
  onBlur = undefined,
  secureTextEntry = false,
  optional = false,
  style = null,
}) => {
  let [fontsLoaded] = useFonts({
    SourceSansPro_400Regular,
    SourceSansPro_400Regular_Italic,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={[styles.root, style]}>
      {(value !== '' && label !== '') || placeholder === '' ? (
        <Text
          style={[styles.label, { fontFamily: 'SourceSansPro_400Regular' }]}
        >
          {label}
        </Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        editable={editable}
        onBlur={onBlur}
        style={[styles.field, { fontFamily: 'SourceSansPro_400Regular' }]}
        secureTextEntry={secureTextEntry}
      />
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
    </View>
  )
}

export default CustomTextInput
