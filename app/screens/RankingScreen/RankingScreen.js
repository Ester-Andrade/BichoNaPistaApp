import React from 'react'
import { ScrollView, View, Image, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import {
  useFonts,
  SourceSansPro_700Bold_Italic,
  SourceSansPro_600SemiBold_Italic,
  SourceSansPro_600SemiBold,
} from '@expo-google-fonts/source-sans-pro'
import { NetworkConsumer } from 'react-native-offline'
import CustomHeader from '../../components/CustomHeader'
import CustomDivider from '../../components/CustomDivider'
import colors from '../../config/styles'
import images from '../../config/images'
import styles from './styles'

const RankingScreen = () => {
  const data = [
    'Jésssica Pacheco',
    'Ronaldo Ferreira',
    'Carolina de Souza',
    'Carlos Costa',
    'Joana Pereria',
    'Gustavo Pereira',
    'Bruno Gomes',
    'João Silva',
    'Marina Nunes',
    'Gustavo Nascimento',
  ]
  const top3 = data.splice(0, 3)

  let [fontsLoaded] = useFonts({
    SourceSansPro_700Bold_Italic,
    SourceSansPro_600SemiBold_Italic,
    SourceSansPro_600SemiBold,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={styles.root}>
      <CustomHeader hasLogo={false} />
      <LinearGradient
        colors={[colors.darkYellow, colors.yellow]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <Text
          style={[styles.title, { fontFamily: 'SourceSansPro_600SemiBold' }]}
        >
          Ranking do mês
        </Text>
        <View style={styles.top3Line}>
          {top3.map((user, i) => (
            <View key={i} style={styles['pos' + (i + 1)]}>
              <View style={styles['pos' + (i + 1) + 'Circle']}></View>
              <Text
                style={[
                  styles.text,
                  { fontFamily: 'SourceSansPro_600SemiBold_Italic' },
                ]}
              >
                {user}
              </Text>
              <Text
                style={[
                  styles.text,
                  { fontFamily: 'SourceSansPro_700Bold_Italic' },
                ]}
              >
                1043 pts
              </Text>
              <Text
                style={[
                  styles.text,
                  { fontFamily: 'SourceSansPro_600SemiBold_Italic' },
                ]}
              >
                3040 pts
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>
      <ScrollView
        nestedScrollEnabled={true}
        style={styles.scrollRoot}
        contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}
      >
        <Image source={images.miniLogo} style={styles.watermark} />
        <View style={styles.lineTitle}>
          <Text
            style={[
              styles.text,
              styles.pointsTitle,
              { fontFamily: 'SourceSansPro_600SemiBold_Italic' },
            ]}
          >
            mensal
          </Text>
          <Text
            style={[
              styles.text,
              styles.pointsTitle,
              { fontFamily: 'SourceSansPro_600SemiBold_Italic' },
            ]}
          >
            geral
          </Text>
        </View>
        {data.map((user, i) => (
          <View key={i} style={styles.line}>
            <View style={styles.number}>
              <Text
                style={[
                  styles.text,
                  { fontFamily: 'SourceSansPro_600SemiBold_Italic' },
                ]}
              >
                {i + 4}
              </Text>
            </View>
            <View style={styles.circle}></View>
            <View style={styles.userName}>
              <Text
                style={[
                  styles.text,
                  { fontFamily: 'SourceSansPro_600SemiBold_Italic' },
                ]}
              >
                {user}
              </Text>
            </View>
            <View style={styles.points}>
              <Text
                style={[
                  styles.text,
                  { fontFamily: 'SourceSansPro_700Bold_Italic' },
                ]}
              >
                1000 pts
              </Text>
            </View>
            <View style={styles.points}>
              <Text
                style={[
                  styles.text,
                  { fontFamily: 'SourceSansPro_600SemiBold_Italic' },
                ]}
              >
                1250 pts
              </Text>
            </View>
          </View>
        ))}
        <CustomDivider style={styles.divider}/>
        <View style={styles.finalLine}>
            <View style={styles.number}>
              <Text
                style={[
                  styles.text,
                  { fontFamily: 'SourceSansPro_600SemiBold_Italic' },
                ]}
              >
                25
              </Text>
            </View>
            <View style={styles.circle}></View>
            <View style={styles.userName}>
              <Text
                style={[
                  styles.text,
                  { fontFamily: 'SourceSansPro_600SemiBold_Italic' },
                ]}
              >
                João Silva
              </Text>
            </View>
            <View style={styles.points}>
              <Text
                style={[
                  styles.text,
                  { fontFamily: 'SourceSansPro_700Bold_Italic' },
                ]}
              >
                1000 pts
              </Text>
            </View>
            <View style={styles.points}>
              <Text
                style={[
                  styles.text,
                  { fontFamily: 'SourceSansPro_600SemiBold_Italic' },
                ]}
              >
                1250 pts
              </Text>
            </View>
          </View>
      </ScrollView>
      <NetworkConsumer>
        {({ isConnected }) => (isConnected ? null : <NoConnection />)}
      </NetworkConsumer>
    </View>
  )
}

export default RankingScreen
