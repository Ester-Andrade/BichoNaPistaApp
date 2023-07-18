import React, { useState, useEffect, useContext } from 'react'
import {
  ScrollView,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useIsConnected } from 'react-native-offline'
import { AuthContext } from '../../context/Auth'
import { RegistrationContext } from '../../context/Registration'
import { MonitoringContext } from '../../context/Monitoring'
import * as Location from 'expo-location'
import CustomHeader from '../../components/CustomHeader'
import CameraComponent from '../CameraView/CameraView'
import PhotoComponent from '../../components/PhotoComponent'
import CustomTextInput from '../../components/CustomTextInput'
import CustomDropDown from '../../components/CustomDropDown'
import PressableText from '../../components/PressableText'
import CustomDivider from '../../components/CustomDivider'
import CustomCheckBox from '../../components/CustomCheckBox'
import CustomTextArea from '../../components/CustomTextArea'
import CustomButton from '../../components/CustomButton'
import NoConnection from '../../components/NoConnection'
import CustomAlert from '../../components/CustomAlert'
import getData from './RegistrationScreenContainer'
import images from '../../config/images'
import colors from '../../config/styles'
import styles from './styles'

const OccurrenceSchemaForAgent = Yup.object().shape({
  photo1: Yup.string().required('Preencha ao menos o primeiro campo de foto.'),
  local: Yup.string().required('Campo Obrigatório.'),
  n_individuos: Yup.string().matches('^[0-9]+$', 'Deve usar apenas dígitos.'),
  //Animal data
  sexo: Yup.string().required('Campo Obrigatório.'),
  condicao_animal: Yup.string().required('Campo Obrigatório.'),
  destinacao: Yup.array().min(
    1,
    'Campo Obrigatório. Marque pelo menos uma caixa'
  ),
  //road data
  velocidade_max_permitida: Yup.string()
    .matches('^[0-9]+$', 'Deve usar apenas dígitos.')
    .nullable(true),
  km: Yup.string()
    .matches('^[0-9]+$', 'Deve usar apenas dígitos.')
    .nullable(true),
  tipo_de_via: Yup.string().required('Campo Obrigatório.'),
  n_faixas: Yup.string()
    .required('Campo Obrigatório.')
    .matches('^[0-9]+$', 'Deve usar apenas dígitos.'),
  n_pistas: Yup.string()
    .required('Campo Obrigatório.')
    .matches('^[0-9]+$', 'Deve usar apenas dígitos.'),
  tipo_de_divisao: Yup.array().min(
    1,
    'Campo Obrigatório. Marque pelo menos uma caixa'
  ),
  tipo_de_pavimento: Yup.string().required('Campo Obrigatório.'),
  trecho_com_intervencao: Yup.string().required('Campo Obrigatório.'),
  vazamento_na_pista: Yup.string().required('Campo Obrigatório.'),
  //surroundings conditions
  condicoes_do_tempo: Yup.string().required('Campo Obrigatório.'),
  lago_rio_riacho: Yup.string().required('Campo Obrigatório.'),
  vegetacao_entorno: Yup.array().min(
    1,
    'Campo Obrigatório. Marque pelo menos uma caixa'
  ),
  encontrado_em: Yup.string().required('Campo Obrigatório.'),
  animal_em_uc: Yup.string().required('Campo Obrigatório.'),
})

const OccurrenceSchemaForCitizen = Yup.object().shape({
  photo1: Yup.string().required('Preencha ao menos o primeiro campo de foto.'),
  local: Yup.string().required('Campo Obrigatório.'),
  n_individuos: Yup.string()
    .matches('^[0-9]+$', 'Deve usar apenas dígitos.')
    .nullable(true),
  velocidade_max_permitida: Yup.string()
    .matches('^[0-9]+$', 'Deve usar apenas dígitos.')
    .nullable(true),
  km: Yup.string()
    .matches('^[0-9]+$', 'Deve usar apenas dígitos.')
    .nullable(true),
  n_faixas: Yup.string()
    .matches('^[0-9]+$', 'Deve usar apenas dígitos.')
    .nullable(true),
  n_pistas: Yup.string()
    .matches('^[0-9]+$', 'Deve usar apenas dígitos.')
    .nullable(true),
})

const RegistrationScreen = ({ navigation, route }) => {
  const { userType, userToken } = useContext(AuthContext)
  const { sendAttempt } = useContext(RegistrationContext)
  const { inMonitoring, addOccurrence } = useContext(MonitoringContext)

  // ========================= form's data options =========================
  const [grupoTaxOp, setGrupoTaxOp] = useState([])
  const [especieOp, setEspecieOp] = useState([])
  const sexosOp = [{ op: 'Fêmea' }, { op: 'Macho' }, { op: 'Não sei' }]
  const condAnimalOp = [{ op: 'Vivo' }, { op: 'Morto' }, { op: 'Carcaça' }]
  const causaOp = [{ op: 'Atropelamento' }, { op: 'Outras razões' }]
  const animalVivoOp = [
    { op: 'Visualização na via' },
    { op: 'Afugentamento/Realocação' },
  ]
  const [destAnimalOp, setDestAnimalOp] = useState([])
  const [instituDepositariaOp, setInstituDepositariaOp] = useState([])
  const [sentidoOp, setSentidoOp] = useState([])
  const tipoViaOp = [{ op: 'Simples' }, { op: 'Mão dupla' }]
  const [divPistasOp, setDivPistasOp] = useState([])
  const [pavimentoOp, setPavimentoOp] = useState([])
  const booleanOp = [
    { op: 1, opName: 'Sim' },
    { op: 0, opName: 'Não' },
  ]
  const condicaoTempoOp = [
    { op: 'Sem chuva' },
    { op: 'Chuva fina' },
    { op: 'Chuva forte' },
  ]
  const SimNaoNsOp = [{ op: 'Sim' }, { op: 'Não' }, { op: 'Não sei' }]
  const [vegetacaoOp, setVegetacaoOp] = useState([])
  const [encontradoEmOp, setEncontradoEmOp] = useState([])

  // ========================= control states =========================
  const [gettingData, setGettingData] = useState(true)
  const [sendingData, setSendingData] = useState(false)
  const [type, setType] = useState(userType === 1 ? 'shrinker' : 'expander')
  const [advancedOpIsOpen, setAdvancedOpIsOpen] = useState(userType === 1)
  const [openCamera, setOpenCamera] = useState(false)
  const [wPhoto, setWPhoto] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState(true)

  // ======================= Occurrence position ======================
  const [initLatitude, setInitLatitude] = useState(null)
  const [initLongitude, setInitLongitude] = useState(null)
  const [initPlace, setInitPlace] = useState(null)

  const isConnected = useIsConnected()

  useEffect(() => {
    ;(async () => {
      await getData(
        isConnected,
        setGrupoTaxOp,
        setEspecieOp,
        setDestAnimalOp,
        setInstituDepositariaOp,
        setSentidoOp,
        setDivPistasOp,
        setPavimentoOp,
        setVegetacaoOp,
        setEncontradoEmOp
      )
      console.warn('alou')
      try {
        const {
          coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true,
        })
        console.warn('alou2')
        setInitLatitude(latitude)
        setInitLongitude(longitude)

        const place = await Location.reverseGeocodeAsync({
          latitude: latitude,
          longitude: longitude,
        })
        setInitPlace([
          place[0].subregion,
          place[0].street,
          place[0].street +
            ' - ' +
            place[0].district +
            ', ' +
            place[0].subregion +
            ' - ' +
            place[0].region,
        ])
      } catch (error) {
        console.warn('alou3')
        setInitPlace(['', '', ''])
        setAlertMsg(
          'Não é possível prosseguir sem a localização! \n\nVerifique se o GPS está ligado.'
        )
        setShowAlert(true)
      }

      setGettingData(false)
    })()
  }, [])

  const onAdvancedOpPressed = () => {
    advancedOpIsOpen ? setType('expander') : setType('shrinker')
    setAdvancedOpIsOpen(!advancedOpIsOpen)
  }

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader />
      {gettingData || sendingData ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size={'large'} color={colors.yellow} />
        </View>
      ) : (
        <Formik
          initialValues={{
            photo1: route.params.photo1,
            photo2: route.params.photo2,
            photo3: route.params.photo3,
            local:
              route.params.local === null ? initPlace[2] : route.params.local,
            latitude: initLatitude,
            longitude: initLongitude,
            grupo_taxonomico: route.params.grupo_taxonomico,
            n_individuos: route.params.n_individuos,
            //Animal data
            especie: route.params.especie,
            nome_comum_nao_cadastrado: route.params.nome_comum_nao_cadastrado,
            nome_cientifico_nao_cadastrado:
              route.params.nome_cientifico_nao_cadastrado,
            sexo: route.params.sexo,
            condicao_animal: route.params.condicao_animal,
            causa: route.params.causa,
            animal_vivo: route.params.animal_vivo,
            destinacao: route.params.destinacao,
            instituicao_depositaria: route.params.instituicao_depositaria,
            //road data
            velocidade_max_permitida: route.params.velocidade_max_permitida,
            sentido_da_via: route.params.sentido_da_via,
            km: route.params.km,
            tipo_de_via: route.params.tipo_de_via,
            n_faixas: route.params.n_faixas,
            n_pistas: route.params.n_pistas,
            tipo_de_divisao: route.params.tipo_de_divisao,
            tipo_de_pavimento: route.params.tipo_de_pavimento,
            trecho_com_intervencao: route.params.trecho_com_intervencao,
            descr_intervencao: route.params.descr_intervencao,
            vazamento_na_pista: route.params.vazamento_na_pista,
            descr_vazamento: route.params.descr_vazamento,
            //surroundings conditions
            condicoes_do_tempo: route.params.condicoes_do_tempo,
            lago_rio_riacho: route.params.lago_rio_riacho,
            vegetacao_entorno: route.params.vegetacao_entorno,
            encontrado_em: route.params.encontrado_em,
            animal_em_uc: route.params.animal_em_uc,
            //observations
            observacoes: route.params.observacoes,
          }}
          validationSchema={
            userType === 1
              ? OccurrenceSchemaForAgent
              : OccurrenceSchemaForCitizen
          }
          onSubmit={(values) => {
            inMonitoring
              ? addOccurrence(
                  [values, new Date(), initPlace[0], initPlace[1], userToken],
                  setAlertMsg,
                  setShowAlert
                )
              : sendAttempt(
                  values,
                  new Date(),
                  initPlace[0],
                  initPlace[1],
                  userToken,
                  setAlertMsg,
                  setShowAlert,
                  setSendingData
                )
          }}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            setFieldTouched,
            isValid,
            handleSubmit,
          }) =>
            openCamera ? (
              <CameraComponent
                setPhoto={(data) => {
                  if (wPhoto === 'photo1') {
                    return setFieldValue('photo1', data.uri)
                  } else if (wPhoto === 'photo2') {
                    return setFieldValue('photo2', data.uri)
                  } else {
                    return setFieldValue('photo3', data.uri)
                  }
                }}
                openCamera={setOpenCamera}
              />
            ) : (
              <ScrollView
                nestedScrollEnabled={true}
                style={styles.root}
                contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}
              >
                <View style={styles.photoView}>
                  <PhotoComponent
                    photo={values.photo1}
                    onPress={() => {
                      setWPhoto('photo1')
                      setOpenCamera(true)
                    }}
                    setPhoto={(value) => setFieldValue('photo1', value)}
                    disabled={!route.params.editable}
                  />
                  <PhotoComponent
                    photo={values.photo2}
                    onPress={() => {
                      setWPhoto('photo2')
                      setOpenCamera(true)
                    }}
                    setPhoto={(value) => setFieldValue('photo2', value)}
                    disabled={!route.params.editable}
                  />
                  <PhotoComponent
                    photo={values.photo3}
                    onPress={() => {
                      setWPhoto('photo3')
                      setOpenCamera(true)
                    }}
                    setPhoto={(value) => setFieldValue('photo3', value)}
                    disabled={!route.params.editable}
                  />
                </View>
                {errors.photo1 && (
                  <Text
                    style={[
                      styles.errors,
                      { fontFamily: 'SourceSansPro_400Regular_Italic' },
                    ]}
                  >
                    {errors.photo1}
                  </Text>
                )}
                <View style={styles.rowView}>
                  <View style={styles.field}>
                    <CustomTextInput
                      placeholder="Local"
                      label="Local"
                      value={values.local}
                      setValue={(value) => setFieldValue('local', value)}
                      editable={route.params.editable}
                      onBlur={() => setFieldTouched('local')}
                      style={{ width: '100%' }}
                    />
                    {touched.local && errors.local && (
                      <Text
                        style={[
                          styles.errors,
                          {
                            fontFamily: 'SourceSansPro_400Regular_Italic',
                            marginHorizontal: 0,
                          },
                        ]}
                      >
                        {errors.local}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      ;(async () => {
                        try {
                          const {
                            coords: { latitude, longitude },
                          } = await Location.getCurrentPositionAsync({
                            enableHighAccuracy: true,
                          })
                          setFieldValue('latitude', latitude)
                          setFieldValue('longitude', longitude)

                          const place = await Location.reverseGeocodeAsync({
                            latitude: latitude,
                            longitude: longitude,
                          })
                          setFieldValue(
                            'local',
                            place[0].street +
                              ' - ' +
                              place[0].district +
                              ', ' +
                              place[0].subregion +
                              ' - ' +
                              place[0].region
                          )
                          setInitPlace([place[0].subregion, place[0].street])
                        } catch (error) {}
                      })()
                    }}
                    disabled={!route.params.editable}
                    style={styles.geolocationBtn}
                  >
                    <Image
                      source={images.icons.tracking}
                      style={styles.geolocationIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.rowView}>
                  <CustomDropDown
                    data={grupoTaxOp}
                    placeholder="Grupo taxonômico"
                    value={values.grupo_taxonomico}
                    setValue={(value) => {
                      setFieldValue('grupo_taxonomico', value)
                      setFieldValue('especie', null)
                    }}
                    wShow="NomeGrupoTax"
                    wSave="CodGrupoTax"
                    optional={true}
                    disabled={!route.params.editable}
                    style={{ width: '60%' }}
                  />
                  <View style={{ width: '30%' }}>
                    <CustomTextInput
                      label="N° indivíduos"
                      value={values.n_individuos}
                      setValue={(value) => setFieldValue('n_individuos', value)}
                      optional={true}
                      editable={route.params.editable}
                      onBlur={() => setFieldTouched('n_individuos')}
                      style={{ width: '100%' }}
                    />
                    {touched.n_individuos && errors.n_individuos && (
                      <Text
                        style={[
                          styles.errors,
                          {
                            fontFamily: 'SourceSansPro_400Regular_Italic',
                            marginHorizontal: 0,
                            backgroundColor: colors.white,
                          },
                        ]}
                      >
                        {errors.n_individuos}
                      </Text>
                    )}
                  </View>
                </View>
                {userType === 1 ? null : (
                  <PressableText
                    onPress={onAdvancedOpPressed}
                    text="Opções de registro avançado"
                    size={15}
                    type={type}
                    style={styles.advancedOps}
                  />
                )}
                {advancedOpIsOpen ? (
                  <View
                    style={{ flex: 1, width: '100%', alignItems: 'center' }}
                  >
                    <CustomDivider
                      label={' Dados do animal '}
                      style={userType === 1 ? styles.divider : styles.divider2}
                    />
                    <CustomDropDown
                      data={
                        values.grupo_taxonomico === null
                          ? especieOp
                          : especieOp.filter(
                              (item) =>
                                item.GrupoTaxonomico === values.grupo_taxonomico
                            )
                      }
                      placeholder="Nome comum"
                      value={values.especie}
                      setValue={(value) => {
                        setFieldValue('especie', value)
                        if (values.grupo_taxonomico === null) {
                          setFieldValue(
                            'grupo_taxonomico',
                            especieOp[
                              especieOp
                                .map((item) => item.CodEspecie)
                                .indexOf(parseInt(value))
                            ]['GrupoTaxonomico']
                          )
                        }
                      }}
                      wShow="NomeComum"
                      wSave="CodEspecie"
                      optional={true}
                      disabled={!route.params.editable}
                      style={styles.field}
                    />
                    <CustomDropDown
                      data={
                        values.grupo_taxonomico === null
                          ? especieOp
                          : especieOp.filter(
                              (item) =>
                                item.GrupoTaxonomico === values.grupo_taxonomico
                            )
                      }
                      placeholder="Nome científico"
                      value={values.especie}
                      setValue={(value) => setFieldValue('especie', value)}
                      wShow="NomeCientifico"
                      wSave="CodEspecie"
                      optional={true}
                      disabled={!route.params.editable}
                      style={styles.field2}
                    />
                    <CustomTextInput
                      placeholder="Nome comum não cadastrado"
                      value={values.nome_comum_nao_cadastrado}
                      setValue={(value) =>
                        setFieldValue('nome_comum_nao_cadastrado', value)
                      }
                      optional={true}
                      editable={route.params.editable}
                      style={styles.field2}
                    />
                    <CustomTextInput
                      placeholder="Nome científico não cadastrado"
                      value={values.nome_cientifico_nao_cadastrado}
                      setValue={(value) =>
                        setFieldValue('nome_cientifico_nao_cadastrado', value)
                      }
                      optional={true}
                      editable={route.params.editable}
                      style={styles.field}
                    />
                    <CustomDropDown
                      data={sexosOp}
                      placeholder="Sexo"
                      value={values.sexo}
                      setValue={(value) => setFieldValue('sexo', value)}
                      wShow="op"
                      wSave="op"
                      optional={!(userType === 1)}
                      disabled={!route.params.editable}
                      touched={() => setFieldTouched('sexo')}
                      style={styles.field}
                    />
                    {touched.sexo && errors.sexo && (
                      <Text
                        style={[
                          styles.errors,
                          { fontFamily: 'SourceSansPro_400Regular_Italic' },
                        ]}
                      >
                        {errors.sexo}
                      </Text>
                    )}
                    <View style={styles.rowView}>
                      <View style={{ width: '50%' }}>
                        <CustomDropDown
                          data={condAnimalOp}
                          placeholder="Condição do animal"
                          value={values.condicao_animal}
                          setValue={(value) =>
                            setFieldValue('condicao_animal', value)
                          }
                          wShow="op"
                          wSave="op"
                          optional={!(userType === 1)}
                          disabled={!route.params.editable}
                          touched={() => setFieldTouched('condicao_animal')}
                          style={{ width: '100%' }}
                        />
                        {touched.condicao_animal && errors.condicao_animal && (
                          <Text
                            style={[
                              styles.errors,
                              {
                                fontFamily: 'SourceSansPro_400Regular_Italic',
                                marginHorizontal: 0,
                              },
                            ]}
                          >
                            {errors.condicao_animal}
                          </Text>
                        )}
                      </View>
                      <CustomDropDown
                        data={causaOp}
                        placeholder="Causa"
                        value={values.causa}
                        setValue={(value) => setFieldValue('causa', value)}
                        wShow="op"
                        wSave="op"
                        optional={true}
                        disabled={!route.params.editable}
                        style={{ width: '40%' }}
                      />
                    </View>
                    <CustomDropDown
                      data={animalVivoOp}
                      placeholder="Animal vivo"
                      value={values.animal_vivo}
                      setValue={(value) => setFieldValue('animal_vivo', value)}
                      wShow="op"
                      wSave="op"
                      optional={true}
                      disabled={!route.params.editable}
                      style={styles.field2}
                    />
                    <CustomCheckBox
                      label={'Destinação:'}
                      data={destAnimalOp}
                      value={values.destinacao}
                      setValue={(value) => setFieldValue('destinacao', value)}
                      wShow="DescrDestino"
                      wSave="CodDestino"
                      optional={!(userType === 1)}
                      style={styles.checkBoxSet}
                      nextTouched={touched.velocidade_max_permitida}
                      errors={errors.destinacao}
                    />
                    <View style={{ width: '85%', alignItems: 'flex-end' }}>
                      <CustomDropDown
                        data={instituDepositariaOp}
                        placeholder="Qual instituição ?"
                        value={values.instituicao_depositaria}
                        setValue={(value) =>
                          setFieldValue('instituicao_depositaria', value)
                        }
                        wShow="NomeInstituicaoDepositaria"
                        wSave="CodInstituicaoDepositaria"
                        optional={true}
                        disabled={!route.params.editable}
                        style={{ width: '83%', marginTop: '-7%' }}
                      />
                    </View>
                    <CustomDivider
                      label={' Dados da pista '}
                      style={styles.divider}
                    />
                    <CustomTextInput
                      placeholder="Velocidade max permitida"
                      value={values.velocidade_max_permitida}
                      setValue={(value) =>
                        setFieldValue('velocidade_max_permitida', value)
                      }
                      optional={true}
                      editable={route.params.editable}
                      onBlur={() => setFieldTouched('velocidade_max_permitida')}
                      style={styles.field}
                    />
                    {touched.velocidade_max_permitida &&
                      errors.velocidade_max_permitida && (
                        <Text
                          style={[
                            styles.errors,
                            {
                              fontFamily: 'SourceSansPro_400Regular_Italic',
                              backgroundColor: colors.white,
                            },
                          ]}
                        >
                          {errors.velocidade_max_permitida}
                        </Text>
                      )}
                    <View style={styles.rowView}>
                      <CustomDropDown
                        data={sentidoOp}
                        placeholder="Sentido da via"
                        value={values.sentido_da_via}
                        setValue={(value) =>
                          setFieldValue('sentido_da_via', value)
                        }
                        wShow="DescrSentido"
                        wSave="CodSentido"
                        optional={true}
                        disabled={!route.params.editable}
                        style={{ width: '65%' }}
                      />
                      <View style={{ width: '25%' }}>
                        <CustomTextInput
                          placeholder="Km"
                          value={values.km}
                          setValue={(value) => setFieldValue('km', value)}
                          optional={true}
                          editable={route.params.editable}
                          onBlur={() => setFieldTouched('km')}
                          style={{ width: '100%' }}
                        />
                        {touched.km && errors.km && (
                          <Text
                            style={[
                              styles.errors,
                              {
                                fontFamily: 'SourceSansPro_400Regular_Italic',
                                marginHorizontal: 0,
                                backgroundColor: colors.white,
                              },
                            ]}
                          >
                            {errors.km}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.rowView2}>
                      <View style={{ width: '40%' }}>
                        <CustomDropDown
                          data={tipoViaOp}
                          placeholder="Tipo de via"
                          value={values.tipo_de_via}
                          setValue={(value) =>
                            setFieldValue('tipo_de_via', value)
                          }
                          wShow="op"
                          wSave="op"
                          optional={!(userType === 1)}
                          disabled={!route.params.editable}
                          touched={() => setFieldTouched('tipo_de_via')}
                          style={{ width: '100%' }}
                        />
                        {touched.tipo_de_via && errors.tipo_de_via && (
                          <Text
                            style={[
                              styles.errors,
                              {
                                fontFamily: 'SourceSansPro_400Regular_Italic',
                                marginHorizontal: 0,
                              },
                            ]}
                          >
                            {errors.tipo_de_via}
                          </Text>
                        )}
                      </View>
                      <View style={{ width: '20%' }}>
                        <CustomTextInput
                          placeholder="N° faixas"
                          value={values.n_faixas}
                          setValue={(value) => setFieldValue('n_faixas', value)}
                          optional={!(userType === 1)}
                          editable={route.params.editable}
                          onBlur={() => setFieldTouched('n_faixas')}
                          style={{ width: '100%' }}
                        />
                        {touched.n_faixas && errors.n_faixas && (
                          <Text
                            style={[
                              styles.errors,
                              {
                                fontFamily: 'SourceSansPro_400Regular_Italic',
                                marginHorizontal: 0,
                              },
                            ]}
                          >
                            {errors.n_faixas}
                          </Text>
                        )}
                      </View>
                      <View style={{ width: '20%' }}>
                        <CustomTextInput
                          placeholder="N° pistas"
                          value={values.n_pistas}
                          setValue={(value) => setFieldValue('n_pistas', value)}
                          optional={!(userType === 1)}
                          editable={route.params.editable}
                          onBlur={() => setFieldTouched('n_pistas')}
                          style={{ width: '100%' }}
                        />
                        {touched.n_pistas && errors.n_pistas && (
                          <Text
                            style={[
                              styles.errors,
                              {
                                fontFamily: 'SourceSansPro_400Regular_Italic',
                                marginHorizontal: 0,
                              },
                            ]}
                          >
                            {errors.n_pistas}
                          </Text>
                        )}
                      </View>
                    </View>
                    <CustomCheckBox
                      label={'Tipo de divisão:'}
                      data={divPistasOp}
                      value={values.tipo_de_divisao}
                      setValue={(value) =>
                        setFieldValue('tipo_de_divisao', value)
                      }
                      wShow="NomeTipoDivisao"
                      wSave="CodTipoDivisao"
                      optional={!(userType === 1)}
                      disabled={!route.params.editable}
                      style={styles.checkBoxSet}
                      nextTouched={touched.tipo_de_pavimento}
                      errors={errors.tipo_de_divisao}
                    />
                    <CustomDropDown
                      data={pavimentoOp}
                      placeholder="Tipo de pavimento"
                      value={values.tipo_de_pavimento}
                      setValue={(value) =>
                        setFieldValue('tipo_de_pavimento', value)
                      }
                      wShow="NomeTipoPavimento"
                      wSave="CodTipoPavimento"
                      optional={!(userType === 1)}
                      disabled={!route.params.editable}
                      touched={() => setFieldTouched('tipo_de_pavimento')}
                      style={styles.field}
                    />
                    {touched.tipo_de_pavimento && errors.tipo_de_pavimento && (
                      <Text
                        style={[
                          styles.errors,
                          { fontFamily: 'SourceSansPro_400Regular_Italic' },
                        ]}
                      >
                        {errors.tipo_de_pavimento}
                      </Text>
                    )}
                    <CustomDropDown
                      data={booleanOp}
                      placeholder="Trecho com intervenção ?"
                      value={values.trecho_com_intervencao}
                      setValue={(value) =>
                        setFieldValue('trecho_com_intervencao', value)
                      }
                      wShow="opName"
                      wSave="op"
                      optional={!(userType === 1)}
                      disabled={!route.params.editable}
                      touched={() => setFieldTouched('trecho_com_intervencao')}
                      style={styles.field}
                    />
                    {touched.trecho_com_intervencao &&
                      errors.trecho_com_intervencao && (
                        <Text
                          style={[
                            styles.errors,
                            { fontFamily: 'SourceSansPro_400Regular_Italic' },
                          ]}
                        >
                          {errors.trecho_com_intervencao}
                        </Text>
                      )}
                    <CustomTextInput
                      placeholder="Qual ?"
                      value={values.descr_intervencao}
                      setValue={(value) =>
                        setFieldValue('descr_intervencao', value)
                      }
                      optional={true}
                      editable={route.params.editable}
                      style={{ width: '85%', marginTop: '-1%' }}
                    />
                    <CustomDropDown
                      data={booleanOp}
                      placeholder="Vazamento de granel alimentício na pista ?"
                      value={values.vazamento_na_pista}
                      setValue={(value) =>
                        setFieldValue('vazamento_na_pista', value)
                      }
                      wShow="opName"
                      wSave="op"
                      optional={!(userType === 1)}
                      disabled={!route.params.editable}
                      touched={() => setFieldTouched('vazamento_na_pista')}
                      style={styles.field}
                    />
                    {touched.vazamento_na_pista &&
                      errors.vazamento_na_pista && (
                        <Text
                          style={[
                            styles.errors,
                            { fontFamily: 'SourceSansPro_400Regular_Italic' },
                          ]}
                        >
                          {errors.vazamento_na_pista}
                        </Text>
                      )}
                    <CustomTextInput
                      placeholder="Qual ?"
                      value={values.descr_vazamento}
                      setValue={(value) =>
                        setFieldValue('descr_vazamento', value)
                      }
                      optional={true}
                      editable={route.params.editable}
                      style={{ width: '85%', marginTop: '-1%' }}
                    />
                    <CustomDivider
                      label={' Condições de entorno '}
                      style={styles.divider}
                    />
                    <CustomDropDown
                      data={condicaoTempoOp}
                      placeholder="Condições do tempo"
                      value={values.condicoes_do_tempo}
                      setValue={(value) =>
                        setFieldValue('condicoes_do_tempo', value)
                      }
                      wShow="op"
                      wSave="op"
                      optional={!(userType === 1)}
                      disabled={!route.params.editable}
                      touched={() => setFieldTouched('condicoes_do_tempo')}
                      style={styles.field}
                    />
                    {touched.condicoes_do_tempo &&
                      errors.condicoes_do_tempo && (
                        <Text
                          style={[
                            styles.errors,
                            { fontFamily: 'SourceSansPro_400Regular_Italic' },
                          ]}
                        >
                          {errors.condicoes_do_tempo}
                        </Text>
                      )}
                    <CustomDropDown
                      data={SimNaoNsOp}
                      placeholder="Presença de lago, rio ou riacho"
                      value={values.lago_rio_riacho}
                      setValue={(value) =>
                        setFieldValue('lago_rio_riacho', value)
                      }
                      wShow="op"
                      wSave="op"
                      optional={!(userType === 1)}
                      disabled={!route.params.editable}
                      touched={() => setFieldTouched('lago_rio_riacho')}
                      style={styles.field}
                    />
                    {touched.lago_rio_riacho && errors.lago_rio_riacho && (
                      <Text
                        style={[
                          styles.errors,
                          { fontFamily: 'SourceSansPro_400Regular_Italic' },
                        ]}
                      >
                        {errors.lago_rio_riacho}
                      </Text>
                    )}
                    <CustomCheckBox
                      label={'Vegetação no entorno:'}
                      data={vegetacaoOp}
                      value={values.vegetacao_entorno}
                      setValue={(value) =>
                        setFieldValue('vegetacao_entorno', value)
                      }
                      wShow="DescrVegetacaoEntorno"
                      wSave="CodVegetacaoEntorno"
                      optional={!(userType === 1)}
                      disabled={!route.params.editable}
                      style={styles.checkBoxSet}
                      nextTouched={touched.encontrado_em}
                      errors={errors.vegetacao_entorno}
                    />
                    <CustomDropDown
                      data={encontradoEmOp}
                      placeholder="Encontrado em"
                      value={values.encontrado_em}
                      setValue={(value) =>
                        setFieldValue('encontrado_em', value)
                      }
                      wShow="DescrEncontradoEm"
                      wSave="CodEncontradoEm"
                      optional={!(userType === 1)}
                      disabled={!route.params.editable}
                      touched={() => setFieldTouched('encontrado_em')}
                      style={styles.field}
                    />
                    {touched.encontrado_em && errors.encontrado_em && (
                      <Text
                        style={[
                          styles.errors,
                          { fontFamily: 'SourceSansPro_400Regular_Italic' },
                        ]}
                      >
                        {errors.encontrado_em}
                      </Text>
                    )}
                    <CustomDropDown
                      data={SimNaoNsOp}
                      placeholder="Animal em UC"
                      value={values.animal_em_uc}
                      setValue={(value) => setFieldValue('animal_em_uc', value)}
                      wShow="op"
                      wSave="op"
                      optional={!(userType === 1)}
                      disabled={!route.params.editable}
                      touched={() => setFieldTouched('animal_em_uc')}
                      style={styles.field}
                    />
                    {touched.animal_em_uc && errors.animal_em_uc && (
                      <Text
                        style={[
                          styles.errors,
                          { fontFamily: 'SourceSansPro_400Regular_Italic' },
                        ]}
                      >
                        {errors.animal_em_uc}
                      </Text>
                    )}
                    <CustomDivider
                      label={' Observações '}
                      style={styles.divider}
                    />
                    <CustomTextArea
                      label={' Observações '}
                      value={values.observacoes}
                      setValue={(value) => setFieldValue('observacoes', value)}
                      nLines={7}
                      editable={route.params.editable}
                      style={styles.obsArea}
                    />
                  </View>
                ) : null}
                {!isValid ? (
                  <Text
                    style={[
                      styles.finalError,
                      { fontFamily: 'SourceSansPro_400Regular_Italic' },
                    ]}
                  >
                    Preencha todos os campos obrigatórios !
                  </Text>
                ) : null}
                <CustomButton
                  onPress={handleSubmit}
                  title="Enviar"
                  disabled={!isValid}
                  style={advancedOpIsOpen ? styles.sendBtn : styles.sendBtn2}
                />
              </ScrollView>
            )
          }
        </Formik>
      )}
      <CustomAlert
        msg={alertMsg}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        onPress={() => navigation.goBack()}
      />
      {isConnected ? null : <NoConnection />}
    </View>
  )
}

export default RegistrationScreen
