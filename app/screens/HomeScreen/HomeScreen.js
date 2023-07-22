import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useIsFocused } from '@react-navigation/native'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import {
  useFonts,
  SourceSansPro_300Light,
  SourceSansPro_700Bold_Italic,
  SourceSansPro_400Regular_Italic,
} from '@expo-google-fonts/source-sans-pro'
import { useIsConnected } from 'react-native-offline'
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
import getData from './HomeScreenContainer'
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

  const [gettingData, setGettingData] = useState(true)
  const [data, setData] = useState(null)

  const flatListRef = useRef(null)

  const getCurrentPosition = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert('Ops!', 'Permissão de acesso a localização negada.')
    }

    try {
      let {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync()

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.7,
        longitudeDelta: 0.7,
      })
    } catch (e) {}
  }

  const isFocused = useIsFocused()
  const isConnected = useIsConnected()

  useEffect(() => {
    ;(async () => {
      if (isConnected && isFocused) {
        await getData(setData)

        getCurrentPosition()

        setGettingData(false)
      } else if (!isConnected) {
        setGettingData(false)
      }
    })()
  }, [isFocused, isConnected])

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
          showsUserLocation={true}
          toolbarEnabled={false}
        >
          {data != null
            ? data.map((roadkill, i) => {
                return (
                  <Marker
                    key={i}
                    coordinate={{
                      latitude: roadkill.Latitude,
                      longitude: roadkill.Longitude,
                    }}
                    onPress={() =>
                      flatListRef.current?.scrollToIndex({
                        index: i,
                        Animated: true,
                      })
                    }
                  />
                )
              })
            : null}
        </MapView>
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
              {gettingData ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ActivityIndicator size={'small'} color={colors.yellow} />
                </View>
              ) : data === null ? (
                <Image
                  source={images.icons.noConnection}
                  style={styles.watermark2}
                />
              ) : (
                <FlatList
                  ref={flatListRef}
                  initialScrollIndex={0}
                  getItemLayout={(data, index) => ({
                    length: WIDTH * 0.8,
                    offset: index * (WIDTH * 0.8 - 15) + (index - 1) * 30,
                    index,
                  })}
                  data={data}
                  keyExtractor={(item) => String(item.CodOcorrencia)}
                  showsHorizontalScrollIndicator={false}
                  snapToOffsets={[...Array(data.length)].map(
                    (x, i) => i * (WIDTH * 0.8 - 15) + (i - 1) * 30
                  )}
                  horizontal
                  snapToAlignment={'start'}
                  scrollEventThrottle={16}
                  decelerationRate="fast"
                  renderItem={({ item }) => (
                    <View style={styles.latestRecordsItem}>
                      <View style={styles.photo}>
                        <Image
                          source={{ uri: item.Foto1 }}
                          style={styles.photoImage}
                        />
                      </View>
                      <View style={styles.info}>
                        {(item.NomeComum || item.NomeComumNaoCadastrado) && (
                          <Text
                            style={[
                              styles.title,
                              { fontFamily: 'SourceSansPro_700Bold_Italic' },
                            ]}
                          >
                            {item.NomeComum != null
                              ? item.NomeComum
                              : item.NomeComumNaoCadastrado}
                          </Text>
                        )}
                        {(item.NomeCientifico ||
                          item.NomeCientificoNaoCadastrado) && (
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.text,
                              { fontFamily: 'SourceSansPro_400Regular_Italic' },
                            ]}
                          >
                            {item.NomeCientifico != null
                              ? item.NomeCientifico
                              : item.NomeCientificoNaoCadastrado}
                          </Text>
                        )}
                        <View style={styles.line}>
                          <Text
                            style={[
                              styles.text,
                              { fontFamily: 'SourceSansPro_400Regular_Italic' },
                            ]}
                          >
                            {item.DataRegistro.split('T')[0].split('-')[2] +
                              '/' +
                              item.DataRegistro.split('T')[0].split('-')[1] +
                              '/' +
                              item.DataRegistro.split('T')[0].split('-')[0]}
                          </Text>
                          <Text
                            style={[
                              styles.text,
                              { fontFamily: 'SourceSansPro_400Regular_Italic' },
                            ]}
                          >
                            {item.HoraRegistro.split(':')[0] +
                              ':' +
                              item.HoraRegistro.split(':')[1]}
                          </Text>
                        </View>
                        {item.NomeGrupoTax && (
                          <Text
                            style={[
                              styles.text,
                              { fontFamily: 'SourceSansPro_400Regular_Italic' },
                            ]}
                          >
                            {item.NomeGrupoTax}
                          </Text>
                        )}
                        {item.CondicaoAnimal && (
                          <Text
                            style={[
                              styles.text,
                              { fontFamily: 'SourceSansPro_400Regular_Italic' },
                            ]}
                          >
                            {item.CondicaoAnimal}
                          </Text>
                        )}
                      </View>
                    </View>
                  )}
                />
              )}
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
      {isConnected ? null : <NoConnection />}
    </View>
  )
}

export default HomeScreen
