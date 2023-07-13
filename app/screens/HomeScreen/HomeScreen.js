import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import {
  useFonts,
  SourceSansPro_300Light,
  SourceSansPro_700Bold_Italic,
  SourceSansPro_400Regular_Italic,
} from '@expo-google-fonts/source-sans-pro'
import { NetworkConsumer } from 'react-native-offline'
import * as Location from 'expo-location'
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps'
import {
  GestureDetector,
  Gesture,
  FlatList,
} from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import CustomHeader from '../../components/CustomHeader'
import NoConnection from '../../components/NoConnection'
import images from '../../config/images'
import colors from '../../config/styles'
import styles from './styles'

const WIDTH = Dimensions.get('window').width
const MAX_TRANSLATE_Y = -WIDTH * 0.4
const MIDDLE_STAGE = -WIDTH * 0.2

const initialRegion = {
  latitude: -22.41647,
  longitude: -43.20088,
  latitudeDelta: 2,
  longitudeDelta: 2,
}

const HomeScreen = ({ navigation }) => {
  const [region, setRegion] = useState()

  const getCurrentPosition = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert('Ops!', 'Permissão de acesso a localização negada.')
    }

    let {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync()

    setRegion({ latitude, longitude, latitudeDelta: 0.7, longitudeDelta: 0.7 })
  }

  useEffect(() => {
    getCurrentPosition()
  }, [])

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
  
  const translateY = useSharedValue(0)

  const scrollTo = useCallback((destination) => {
    'worklet'
    translateY.value = withSpring(destination, { damping: 40 })
  })

  const context = useSharedValue({ y: 0 })
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value }
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y)
      translateY.value = Math.min(translateY.value, 0)
    })
    .onEnd(() => {
      if (translateY.value > MIDDLE_STAGE) {
        scrollTo(0)
      } else {
        scrollTo(MAX_TRANSLATE_Y)
      }
    })

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    }
  })

  let [fontsLoaded] = useFonts({
    SourceSansPro_300Light,
    SourceSansPro_700Bold_Italic,
    SourceSansPro_400Regular_Italic,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader hasLogo={false} />
      <View style={styles.root}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          initialRegion={initialRegion}
        ></MapView>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.bottomContainer, rBottomSheetStyle]}>
            <View style={styles.latestRecords}>
              <View style={styles.handle} />
              <Text
                style={[
                  styles.latestRecordsText,
                  { fontFamily: 'SourceSansPro_300Light' },
                ]}
              >
                ULTIMOS REGISTROS
              </Text>
              <FlatList
                data={data}
                keyExtractor={(item) => String(item)}
                showsHorizontalScrollIndicator={false}
                snapToOffsets={[...Array(data.length)].map(
                  (x, i) => i * (WIDTH * 0.80 - 15) + (i - 1) * 30
                )}
                horizontal
                snapToAlignment={'start'}
                scrollEventThrottle={16}
                decelerationRate="fast"
                renderItem={({ item }) => (
                  <View style={styles.latestRecordsItem}>
                    <View style={styles.photo}></View>
                    <View style={styles.info}>
                      <Text
                        style={[styles.title, { fontFamily: 'SourceSansPro_700Bold_Italic' }]}
                      >
                        Capivara
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[ styles.text,
                          { fontFamily: 'SourceSansPro_400Regular_Italic' },
                        ]}
                      >
                        Hydrochoerus hydrochaeris
                      </Text>
                      <View style={styles.line}>
                      <Text
                        style={[styles.text,
                          { fontFamily: 'SourceSansPro_400Regular_Italic' },
                        ]}
                      >
                        05/08/2021
                      </Text>
                      <Text
                        style={[styles.text,
                          { fontFamily: 'SourceSansPro_400Regular_Italic' },
                        ]}
                      >
                        10:30
                      </Text>
                      </View>
                      <Text
                        style={[styles.text,
                          { fontFamily: 'SourceSansPro_400Regular_Italic' },
                        ]}
                      >
                        Mamífero
                      </Text>
                      <Text
                        style={[styles.text,
                          { fontFamily: 'SourceSansPro_400Regular_Italic' },
                        ]}
                      >
                        Vivo
                      </Text>
                    </View>
                  </View>
                )}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() =>
                navigation.navigate('Registro', {
                  editable: true,
                  photo1: null,
                  photo2: null,
                  photo3: null,
                  local: null,
                  grupo_taxonomico: null,
                  n_individuos: '1',
                  //Animal data
                  especie: null,
                  nome_comum_nao_cadastrado: null,
                  nome_cientifico_nao_cadastrado: null,
                  sexo: null,
                  condicao_animal: null,
                  causa: null,
                  animal_vivo: null,
                  destinacao: [],
                  instituicao_depositaria: null,
                  //road data
                  velocidade_max_permitida: null,
                  sentido_da_via: null,
                  km: null,
                  tipo_de_via: null,
                  n_faixas: null,
                  n_pistas: null,
                  tipo_de_divisao: [],
                  tipo_de_pavimento: null,
                  trecho_com_intervencao: null,
                  descr_intervencao: null,
                  vazamento_na_pista: null,
                  descr_vazamento: null,
                  //surroundings conditions
                  condicoes_do_tempo: null,
                  lago_rio_riacho: null,
                  vegetacao_entorno: [],
                  encontrado_em: null,
                  animal_em_uc: null,
                  //observations
                  observacoes: null,
                })
              }
              style={styles.addBtn}
            >
              <LinearGradient
                colors={[colors.darkYellow, '#FFDE3B']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Image
                  source={images.icons.pinAdd}
                  style={styles.BtnImage}
                  resizeMode="contain"
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </GestureDetector>
      </View>
      <NetworkConsumer>
        {({ isConnected }) => (isConnected ? null : <NoConnection />)}
      </NetworkConsumer>
    </View>
  )
}

export default HomeScreen
