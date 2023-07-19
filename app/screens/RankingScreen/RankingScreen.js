import React, { useState, useContext, useEffect } from 'react'
import { ScrollView, View, Image, Text, ActivityIndicator } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import {
  useFonts,
  SourceSansPro_700Bold_Italic,
  SourceSansPro_600SemiBold_Italic,
  SourceSansPro_600SemiBold,
} from '@expo-google-fonts/source-sans-pro'
import { useIsConnected } from 'react-native-offline'
import { AuthContext } from '../../context/Auth'
import CustomHeader from '../../components/CustomHeader'
import CustomDivider from '../../components/CustomDivider'
import getData from './RankingScreenContainer'
import colors from '../../config/styles'
import images from '../../config/images'
import styles from './styles'

const RankingScreen = () => {
  const { userToken, userType, setRankPos } = useContext(AuthContext)

  const [gettingData, setGettingData] = useState(true)
  const [data, setData] = useState(null)
  const [top3, setTop3] = useState(null)
  const [finalData, setFinalData] = useState(null)

  const isConnected = useIsConnected()

  useEffect(() => {
    ;(async () => {
      if (isConnected) {
        await getData(
          userType,
          userToken,
          setRankPos,
          setData,
          setTop3,
          setFinalData
        )
      }

      setGettingData(false)
    })()
  }, [])

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
      {gettingData ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size={'large'} color={colors.yellow} />
        </View>
      ) : (
        <View style={styles.root}>
          {data === null ? (
            <View>
              <Image
                source={images.icons.noConnection}
                style={styles.watermark2}
              />
              <Text
                style={[
                  styles.noConnectionText,
                  { fontFamily: 'SourceSansPro_600SemiBold' },
                ]}
              >
                Sem conexão com a internet.
              </Text>
            </View>
          ) : (
            <View style={styles.root}>
              <LinearGradient
                colors={[colors.darkYellow, colors.yellow]}
                style={styles.gradient}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              >
                <Text
                  style={[
                    styles.title,
                    { fontFamily: 'SourceSansPro_600SemiBold' },
                  ]}
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
                        {user.nome}
                      </Text>
                      <Text
                        style={[
                          styles.text,
                          { fontFamily: 'SourceSansPro_700Bold_Italic' },
                        ]}
                      >
                        {user.NregMes} pts
                      </Text>
                      <Text
                        style={[
                          styles.text,
                          { fontFamily: 'SourceSansPro_600SemiBold_Italic' },
                        ]}
                      >
                        {user.NregTot} pts
                      </Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
              <ScrollView
                nestedScrollEnabled={true}
                style={styles.root}
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
                        {user.RankResult}
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
                        {user.nome}
                      </Text>
                    </View>
                    <View style={styles.points}>
                      <Text
                        style={[
                          styles.text,
                          { fontFamily: 'SourceSansPro_700Bold_Italic' },
                        ]}
                      >
                        {user.NregMes} pts
                      </Text>
                    </View>
                    <View style={styles.points}>
                      <Text
                        style={[
                          styles.text,
                          { fontFamily: 'SourceSansPro_600SemiBold_Italic' },
                        ]}
                      >
                        {user.NregTot} pts
                      </Text>
                    </View>
                  </View>
                ))}
                {finalData !== null ? (
                  <View style={styles.finalView}>
                    <CustomDivider style={styles.divider} />
                    <View style={styles.finalLine}>
                      <View style={styles.number}>
                        <Text
                          style={[
                            styles.text,
                            { fontFamily: 'SourceSansPro_600SemiBold_Italic' },
                          ]}
                        >
                          {finalData.RankResult}
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
                          {finalData.nome}
                        </Text>
                      </View>
                      <View style={styles.points}>
                        <Text
                          style={[
                            styles.text,
                            { fontFamily: 'SourceSansPro_700Bold_Italic' },
                          ]}
                        >
                          {finalData.NregMes} pts
                        </Text>
                      </View>
                      <View style={styles.points}>
                        <Text
                          style={[
                            styles.text,
                            { fontFamily: 'SourceSansPro_600SemiBold_Italic' },
                          ]}
                        >
                          {finalData.NregTot} pts
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.finalMargin} />
                )}
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

export default RankingScreen
