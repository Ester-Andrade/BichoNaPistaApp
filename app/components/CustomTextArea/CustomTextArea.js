import React from 'react'
import { View, Text, TextInput } from 'react-native'
import {
  useFonts,
  SourceSansPro_400Regular,
  SourceSansPro_400Regular_Italic,
} from '@expo-google-fonts/source-sans-pro'
import styles from './styles'

const CustomTextArea = ({
  label,
  value,
  setValue,
  nLines,
  editable = true,
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
      <TextInput
        multiline={true}
        numberOfLines={nLines}
        value={value}
        onChangeText={setValue}
        editable={editable}
        style={[styles.field, { fontFamily: 'SourceSansPro_400Regular' }]}
      />
      <Text style={[styles.label, { fontFamily: 'SourceSansPro_400Regular' }]}>
        {label}
      </Text>
      <Text
        style={[
          styles.optional,
          { fontFamily: 'SourceSansPro_400Regular_Italic' },
        ]}
      >
        Opcional
      </Text>
    </View>
  )
}

export default CustomTextArea
