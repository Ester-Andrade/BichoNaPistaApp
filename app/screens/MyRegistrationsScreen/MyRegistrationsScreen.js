import React from 'react'
import { ScrollView, View, Image, Text } from 'react-native'
import {
  useFonts,
  SourceSansPro_700Bold_Italic,
  SourceSansPro_400Regular_Italic,
} from '@expo-google-fonts/source-sans-pro'
import { useIsConnected } from 'react-native-offline'
import CustomHeader from '../../components/CustomHeader'
import PressableText from '../../components/PressableText/PressableText'
import images from '../../config/images'
import styles from './styles'

const MyRegistrationsScreen = () => {
  const isConnected = useIsConnected()
  const data = [
    '#FF6633',
    '#FFB399',
    '#FF33FF',
    '#FFFF99',
    '#00B3E6',
    '#E6B333',
    '#99FF99',
    '#B34D4D',
  ]

  let [fontsLoaded] = useFonts({
    SourceSansPro_700Bold_Italic,
    SourceSansPro_400Regular_Italic,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={styles.root}>
      <CustomHeader />
      <ScrollView
        nestedScrollEnabled={true}
        style={styles.root}
        contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}
      >
        {data.map(({ item }, i) => (
          <View key={i} style={[styles.Card, i == 0 ? {marginTop: 16,} : null]}>
            <View style={styles.CardHeader}>
              <Text
                style={[
                  styles.title,
                  { fontFamily: 'SourceSansPro_700Bold_Italic' },
                ]}
              >
                Capivara
              </Text>
              <Image
                source={images.icons.clock}
                style={styles.clockIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.CardInfo}>
              <View style={styles.photo}></View>
              <View style={styles.info}>
                <View style={styles.line}>
                  <Text
                    style={[
                      styles.text,
                      { fontFamily: 'SourceSansPro_400Regular_Italic' },
                    ]}
                  >
                    05/08/2021
                  </Text>
                  <Text
                    style={[
                      styles.text,
                      { fontFamily: 'SourceSansPro_400Regular_Italic' },
                    ]}
                  >
                    10:30
                  </Text>
                </View>
                <Text
                  style={[
                    styles.text,
                    { fontFamily: 'SourceSansPro_400Regular_Italic' },
                  ]}
                >
                  Vivo
                </Text>
                <Text
                  style={[
                    styles.text,
                    { fontFamily: 'SourceSansPro_400Regular_Italic' },
                  ]}
                >
                  Status: aguardando rede
                </Text>
                <View style={styles.line}>
                  <Text
                    style={[
                      styles.text2,
                      { fontFamily: 'SourceSansPro_400Regular_Italic' },
                    ]}
                  >
                    A complementar
                  </Text>
                  <PressableText
                    onPress={() => console.log('edtar pressed')}
                    text="editar"
                    size={12}
                    type="editar"
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      {isConnected ? null : <NoConnection />}
    </View>
  )
}

export default MyRegistrationsScreen
