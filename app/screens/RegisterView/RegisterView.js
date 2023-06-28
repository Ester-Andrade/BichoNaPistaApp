import React from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import {
  useFonts,
  SourceSansPro_400Regular_Italic,
} from '@expo-google-fonts/source-sans-pro'
import { useIsConnected } from 'react-native-offline'
import { useHeaderHeight } from '@react-navigation/elements'
import { Formik } from 'formik'
import * as Yup from 'yup'
import CustomTextInput from '../../components/CustomTextInput'
import CustomButton from '../../components/CustomButton'
import register from './RegisterViewContainer'
import images from '../../config/images'
import styles from './styles'

const SignupSchema = Yup.object().shape({
  fullname: Yup.string().min(6, 'Muito curto.').required('Campo Obrigatório.'),
  email: Yup.string()
    .email('Endereço de email válido.')
    .required('Campo Obrigatório.'),
  password: Yup.string()
    .min(8, 'Deve possuir pelo menos 8 caracteres.')
    .required('Campo Obrigatório.')
    .matches(
      '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
      'Deve possuir ao menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'
    ),
  confirmPassword: Yup.string()
    .min(8, 'Deve possuir pelo menos 8 caracteres.')
    .oneOf([Yup.ref('password')], 'Suas senhas não coincidem.')
    .required('Campo Obrigatório.'),
  phone: Yup.string()
    .min(8, 'Deve possuir pelo menos 8 dígitos.')
    .max(11, 'Deve possuir no máximo 11 dígitos.')
    .matches('^[0-9]+$', 'Deve usar apenas dígitos.')
    .nullable(true),
})

const RegisterView = ({ ViewIsOpen, setShowAlert, setAlertMsg }) => {
  const headerHeight = useHeaderHeight()
  const screenHeight = Dimensions.get('screen').height - headerHeight

  const isConnected = useIsConnected()

  const onClosePressed = () => {
    ViewIsOpen(false)
  }

  let [fontsLoaded] = useFonts({
    SourceSansPro_400Regular_Italic,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <Formik
      initialValues={{
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: null,
      }}
      validationSchema={SignupSchema}
      onSubmit={(values) => {
        if (isConnected) {
          register(values, setAlertMsg, setShowAlert, ViewIsOpen)
        } else {
          setAlertMsg('Você está sem conexão à internet')
          ViewIsOpen(false)
          setShowAlert(true)
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        setFieldTouched,
        isValid,
        handleSubmit,
      }) => (
        <View style={styles.root}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={onClosePressed}
            style={styles.closeBtn}
          >
            <Image
              source={images.icons.close}
              style={{
                width: screenHeight * 0.023,
                height: screenHeight * 0.023,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <CustomTextInput
            placeholder="Nome Completo"
            value={values.fullname}
            setValue={handleChange('fullname')}
            onBlur={() => setFieldTouched('fullname')}
          />
          {touched.fullname && errors.fullname && (
            <Text
              style={[
                styles.errors,
                { fontFamily: 'SourceSansPro_400Regular_Italic' },
              ]}
            >
              {errors.fullname}
            </Text>
          )}
          <CustomTextInput
            placeholder="Email"
            value={values.email}
            setValue={handleChange('email')}
            onBlur={() => setFieldTouched('email')}
            style={styles.field}
          />
          {touched.email && errors.email && (
            <Text
              style={[
                styles.errors,
                { fontFamily: 'SourceSansPro_400Regular_Italic' },
              ]}
            >
              {errors.email}
            </Text>
          )}
          <CustomTextInput
            placeholder="Senha"
            value={values.password}
            setValue={handleChange('password')}
            onBlur={() => setFieldTouched('password')}
            secureTextEntry={true}
            style={styles.field}
          />
          {touched.password && errors.password && (
            <Text
              style={[
                styles.errors,
                { fontFamily: 'SourceSansPro_400Regular_Italic' },
              ]}
            >
              {errors.password}
            </Text>
          )}
          <CustomTextInput
            placeholder="Confirmar Senha"
            value={values.confirmPassword}
            setValue={handleChange('confirmPassword')}
            onBlur={() => setFieldTouched('confirmPassword')}
            secureTextEntry={true}
            style={styles.field}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <Text
              style={[
                styles.errors,
                { fontFamily: 'SourceSansPro_400Regular_Italic' },
              ]}
            >
              {errors.confirmPassword}
            </Text>
          )}
          <CustomTextInput
            placeholder="Telefone"
            value={values.phone}
            setValue={handleChange('phone')}
            onBlur={() => setFieldTouched('phone')}
            optional={true}
            style={styles.field}
          />
          {touched.phone && errors.phone && (
            <Text
              style={[
                styles.errors,
                { fontFamily: 'SourceSansPro_400Regular_Italic' },
              ]}
            >
              {errors.phone}
            </Text>
          )}
          <CustomButton
            onPress={handleSubmit}
            title={'Registre-se'}
            disabled={!isValid}
            style={styles.registerBtn}
          />
        </View>
      )}
    </Formik>
  )
}

export default RegisterView
