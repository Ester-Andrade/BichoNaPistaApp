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
import sendMail from './ForgotPasswordViewContainer'
import images from '../../config/images'
import styles from './styles'

const RecoverSchema = Yup.object().shape({
  email: Yup.string()
    .email('Endereço de email inválido.')
    .required('Campo Obrigatório.'),
})

const ForgotPasswordView = ({ ViewIsOpen, setShowAlert, setAlertMsg }) => {
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
      initialValues={{ email: '' }}
      validationSchema={RecoverSchema}
      onSubmit={(value) => {
        if (isConnected) {
          sendMail(value.email, setAlertMsg, setShowAlert, ViewIsOpen)
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
        <View
          style={[
            styles.root,
            {
              height: screenHeight * 0.37,
              marginTop: screenHeight * 0.35,
            },
          ]}
        >
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
          <CustomButton
            onPress={handleSubmit}
            title={'Recuperar senha'}
            disabled={!isValid}
            style={styles.recoverBtn}
          />
        </View>
      )}
    </Formik>
  )
}

export default ForgotPasswordView
