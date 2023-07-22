import React, { useState, useContext, useEffect } from 'react'
import { ScrollView, View, Image, Text, ActivityIndicator } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  useFonts,
  SourceSansPro_700Bold_Italic,
  SourceSansPro_400Regular_Italic,
} from '@expo-google-fonts/source-sans-pro'
import { useIsConnected } from 'react-native-offline'
import { AuthContext } from '../../context/Auth'
import NoConnection from '../../components/NoConnection'
import CustomHeader from '../../components/CustomHeader'
import PressableText from '../../components/PressableText/PressableText'
import getData from './ComplementDestinationScreenContainer'
import images from '../../config/images'
import colors from '../../config/styles'
import styles from './styles'

const ComplementDestinationScreen = ({ navigation }) => {
  const isConnected = useIsConnected()
  const isFocused = useIsFocused()

  const { userToken } = useContext(AuthContext)

  const [gettingData, setGettingData] = useState(true)
  const [data, setData] = useState(null)
  const [offData, setOffData] = useState(null)
  const [localToCompl, setLocalToCompl] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (isConnected) {
        await getData(userToken, setData)
      }

      let offData = await AsyncStorage.getItem('registrationQueue')
      offData = JSON.parse(offData)
      if (offData != null) {
        for (let data of offData) {
          data[1] = new Date(data[1])
          data[0].destinacao.includes(1) ? setLocalToCompl(true) : null
        }
      }
      setOffData(offData)

      setGettingData(false)
    })()
  }, [isFocused])

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
      {gettingData ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size={'large'} color={colors.yellow} />
        </View>
      ) : data === null ? (
        !localToCompl ? (
          <Image source={images.icons.noConnection} style={styles.watermark2} />
        ) : (
          <ScrollView
            nestedScrollEnabled={true}
            style={styles.root}
            contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}
          >
            {offData.map((item, i) =>
              item[0].destinacao.includes(1) ? (
                <View
                  key={i}
                  style={[styles.Card, i == 0 ? { marginTop: 16 } : null]}
                >
                  <View style={styles.CardHeader}>
                    <Text
                      style={[
                        styles.title,
                        { fontFamily: 'SourceSansPro_700Bold_Italic' },
                      ]}
                    >
                      {item[5]}
                    </Text>
                    <Image
                      source={images.icons.clock}
                      style={styles.clockIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.CardInfo}>
                    <View style={styles.photo}>
                      <Image
                        source={{ uri: item[0].photo1 }}
                        style={styles.photoImage}
                      />
                    </View>
                    <View style={styles.info}>
                      <View style={styles.line}>
                        <Text
                          style={[
                            styles.text,
                            { fontFamily: 'SourceSansPro_400Regular_Italic' },
                          ]}
                        >
                          {('00' + item[1].getDate()).slice(-2) +
                            '/' +
                            ('00' + (item[1].getMonth() + 1)).slice(-2) +
                            '/' +
                            ('00' + item[1].getFullYear()).slice(-2)}
                        </Text>
                        <Text
                          style={[
                            styles.text,
                            { fontFamily: 'SourceSansPro_400Regular_Italic' },
                          ]}
                        >
                          {('00' + item[1].getHours()).slice(-2) + ':' + ('00' + item[1].getMinutes()).slice(-2)}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.text,
                          { fontFamily: 'SourceSansPro_400Regular_Italic' },
                        ]}
                      >
                        {item[0].condicao_animal == null ? '' : item[0].condicao_animal}
                      </Text>
                      <Text
                        style={[
                          styles.text,
                          { fontFamily: 'SourceSansPro_400Regular_Italic' },
                        ]}
                      >
                        {item[0].local == null ? '' : item[0].local}
                      </Text>
                    </View>
                  </View>
                  <PressableText
                    text="editar"
                    size={16}
                    type="editar2"
                    style={styles.editar}
                    onPress={() =>
                      navigation.navigate('Registro', {
                        editable: false,
                        id: i,
                        offData: true,
                        photo1: item[0].photo1,
                        photo2: item[0].photo2,
                        photo3: item[0].photo3,
                        local:
                          item[0].local == null ? '' : String(item[0].local),
                        grupo_taxonomico: item[0].grupo_taxonomico,
                        n_individuos:
                          item[0].n_individuos == null
                            ? ''
                            : String(item[0].n_individuos),
                        //Animal data
                        especie: item[0].especie,
                        nome_comum_nao_cadastrado:
                          item[0].nome_comum_nao_cadastrado == null
                            ? ''
                            : String(item[0].nome_comum_nao_cadastrado),
                        nome_cientifico_nao_cadastrado:
                          item[0].nome_cientifico_nao_cadastrado == null
                            ? ''
                            : String(item[0].nome_cientifico_nao_cadastrado),
                        sexo: item[0].sexo,
                        condicao_animal: item[0].condicao_animal,
                        causa: item[0].causa,
                        animal_vivo: item[0].animal_vivo,
                        destinacao: item[0].destinacao,
                        instituicao_depositaria:
                          item[0].instituicao_depositaria,
                        //road data
                        velocidade_max_permitida:
                          item[0].velocidade_max_permitida == null
                            ? ''
                            : String(item[0].velocidade_max_permitida),
                        sentido_da_via: item[0].sentido_da_via,
                        km: item[0].km == null ? '' : String(item[0].km),
                        tipo_de_via: item[0].tipo_de_via,
                        n_faixas:
                          item[0].n_faixas == null
                            ? ''
                            : String(item[0].n_faixas),
                        n_pistas:
                          item[0].n_pistas == null
                            ? ''
                            : String(item[0].n_pistas),
                        tipo_de_divisao: item[0].tipo_de_divisao,
                        tipo_de_pavimento: item[0].tipo_de_pavimento,
                        trecho_com_intervencao: item[0].trecho_com_intervencao,
                        descr_intervencao:
                          item[0].descr_intervencao == null
                            ? ''
                            : String(item[0].descr_intervencao),
                        vazamento_na_pista: item[0].vazamento_na_pista,
                        descr_vazamento:
                          item[0].descr_vazamento == null
                            ? ''
                            : String(item[0].descr_vazamento),
                        //surroundings conditions
                        condicoes_do_tempo: item[0].condicoes_do_tempo,
                        lago_rio_riacho: item[0].lago_rio_riacho,
                        vegetacao_entorno: item[0].vegetacao_entorno,
                        encontrado_em: item[0].encontrado_em,
                        animal_em_uc: item[0].animal_em_uc,
                        //observations
                        observacoes:
                          item[0].observacoes == null
                            ? ''
                            : String(item[0].observacoes),
                      })
                    }
                  />
                </View>
              ) : null
            )}
          </ScrollView>
        )
      ) : data.length === 0 ? (
        <Text
          style={[
            styles.noRegsText,
            { fontFamily: 'SourceSansPro_700Bold_Italic' },
          ]}
        >
          Você não possui registros a complementar para visualizar no momento!
        </Text>
      ) : (
        <ScrollView
          nestedScrollEnabled={true}
          style={styles.root}
          contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}
        >
          {data.map((reg, i) => (
            <View
              key={i}
              style={[styles.Card, i == 0 ? { marginTop: 16 } : null]}
            >
              <View style={styles.CardHeader}>
                <Text
                  style={[
                    styles.title,
                    { fontFamily: 'SourceSansPro_700Bold_Italic' },
                  ]}
                >
                  {reg.NomeComum == null
                    ? reg.NomeComumNaoCadastrado == null
                      ? ''
                      : reg.NomeComumNaoCadastrado
                    : reg.NomeComum}
                </Text>
              </View>
              <View style={styles.CardInfo}>
                <View style={styles.photo}>
                  <Image
                    source={{ uri: reg.Foto1 }}
                    style={styles.photoImage}
                  />
                </View>
                <View style={styles.info}>
                  <View style={styles.line}>
                    <Text
                      style={[
                        styles.text,
                        { fontFamily: 'SourceSansPro_400Regular_Italic' },
                      ]}
                    >
                      {reg.DataRegistro.split('T')[0].split('-')[2] +
                        '/' +
                        reg.DataRegistro.split('T')[0].split('-')[1] +
                        '/' +
                        reg.DataRegistro.split('T')[0].split('-')[0]}
                    </Text>
                    <Text
                      style={[
                        styles.text,
                        { fontFamily: 'SourceSansPro_400Regular_Italic' },
                      ]}
                    >
                      {reg.HoraRegistro.split(':')[0] +
                        ':' +
                        reg.HoraRegistro.split(':')[1]}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.text,
                      { fontFamily: 'SourceSansPro_400Regular_Italic' },
                    ]}
                  >
                    {reg.CondicaoAnimal == null ? '' : reg.CondicaoAnimal}
                  </Text>
                  <Text
                    style={[
                      styles.text,
                      { fontFamily: 'SourceSansPro_400Regular_Italic' },
                    ]}
                  >
                    {reg.Endereco == null ? '' : reg.Endereco}
                  </Text>
                </View>
              </View>
              <PressableText
                text="editar"
                size={16}
                type="editar2"
                style={styles.editar}
                onPress={() =>
                  navigation.navigate('Registro', {
                    editable: false,
                    id: reg.CodOcorrencia,
                    offData: false,
                    photo1: reg.Foto1,
                    photo2: reg.Foto2,
                    photo3: reg.Foto3,
                    local: reg.Endereco == null ? '' : String(reg.Endereco),
                    grupo_taxonomico: reg.GrupoTaxonomico,
                    n_individuos:
                      reg.NumeroIndividuos == null
                        ? ''
                        : String(reg.NumeroIndividuos),
                    //Animal data
                    especie: reg.Especie,
                    nome_comum_nao_cadastrado:
                      reg.NomeComumNaoCadastrado == null
                        ? ''
                        : String(reg.NomeComumNaoCadastrado),
                    nome_cientifico_nao_cadastrado:
                      reg.NomeCientificoNaoCadastrado == null
                        ? ''
                        : String(reg.NomeCientificoNaoCadastrado),
                    sexo: reg.Sexo,
                    condicao_animal: reg.CondicaoAnimal,
                    causa: reg.Causa,
                    animal_vivo: reg.AnimalVivo,
                    destinacao: reg.destinacao,
                    instituicao_depositaria: reg.InstituicaoDepositaria,
                    //road data
                    velocidade_max_permitida:
                      reg.VelocidadeMax == null
                        ? ''
                        : String(reg.VelocidadeMax),
                    sentido_da_via: reg.Sentido,
                    km: reg.Km == null ? '' : String(reg.Km),
                    tipo_de_via: reg.TipoVia,
                    n_faixas:
                      reg.NumFaixas == null ? '' : String(reg.NumFaixas),
                    n_pistas:
                      reg.NumPistas == null ? '' : String(reg.NumPistas),
                    tipo_de_divisao: reg.divPista,
                    tipo_de_pavimento: reg.TipoPavimento,
                    trecho_com_intervencao: reg.Intervencao,
                    descr_intervencao:
                      reg.DescrIntervencao == null
                        ? ''
                        : String(reg.DescrIntervencao),
                    vazamento_na_pista: reg.Vazamento,
                    descr_vazamento:
                      reg.DescrVazamento == null
                        ? ''
                        : String(reg.DescrVazamento),
                    //surroundings conditions
                    condicoes_do_tempo: reg.CondicaoTempo,
                    lago_rio_riacho: reg.LagoRioRiacho,
                    vegetacao_entorno: reg.surrVeg,
                    encontrado_em: reg.EncontradoEm,
                    animal_em_uc: reg.AnimalEmUC,
                    //observations
                    observacoes:
                      reg.Observacoes == null ? '' : String(reg.Observacoes),
                    oStatus: reg.STATUS,
                  })
                }
              />
            </View>
          ))}
        </ScrollView>
      )}

      {isConnected ? null : <NoConnection />}
    </View>
  )
}

export default ComplementDestinationScreen
