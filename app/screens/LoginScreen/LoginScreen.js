import React, { useContext, useState } from 'react'
import { View, Text, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  useFonts,
  SourceSansPro_400Regular,
  SourceSansPro_400Regular_Italic,
} from '@expo-google-fonts/source-sans-pro'
import { useIsConnected } from 'react-native-offline'
import { AuthContext } from '../../context/Auth'
import ForgotPasswordView from '../ForgotPasswordView'
import RegisterView from '../RegisterView'
import CustomHeader from '../../components/CustomHeader'
import CustomTextInput from '../../components/CustomTextInput'
import CustomButton from '../../components/CustomButton'
import PressableText from '../../components/PressableText'
import CircleButton from '../../components/CircleButton'
import CustomAlert from '../../components/CustomAlert'
import NoConnection from '../../components/NoConnection'
import images from '../../config/images'
import styles from './styles'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [forgotPasswordIsOpen, setforgotPasswordIsOpen] = useState(false)
  const [registerIsOpen, setRegisterIsOpen] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState(true)
  const [loginFail, setLoginFail] = useState(false)

  const { logIn } = useContext(AuthContext)

  const isConnected = useIsConnected()

  const onLogInPressed = () => {
    if (isConnected) {
      logIn(email, password, setLoginFail)
    } else {
      setAlertMsg('Você está sem conexão à internet')
      setShowAlert(true)
    }
  }

  const onForgotPasswordPressed = () => {
    setforgotPasswordIsOpen(true)
  }

  const onRegisterPressed = () => {
    setRegisterIsOpen(true)
  }

  const onGoogleLoginPressed = () => {
    if (isConnected) {
      console.warn('Google login pressed')
    } else {
      setAlertMsg('Você está sem conexão à internet')
      setShowAlert(true)
    }
  }

  const onFacebookLoginPressed = () => {
    if (isConnected) {
      console.warn('Facebook login pressed')
    } else {
      setAlertMsg('Você está sem conexão à internet')
      setShowAlert(true)
    }
  }

  let [fontsLoaded] = useFonts({
    SourceSansPro_400Regular,
    SourceSansPro_400Regular_Italic,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={styles.root}>
      <CustomHeader hasLogo={false} />
      <KeyboardAwareScrollView
        style={styles.keyboard}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={43}
      >
        <View style={styles.root}>
          <Image
            source={images.bigLogo}
            style={styles.logo}
            resizeMode="contain"
          />
          {loginFail ? (
            <Text
              style={[
                styles.fail,
                { fontFamily: 'SourceSansPro_400Regular_Italic' },
              ]}
            >
              Email ou senha incorretos! Tente novamente!
            </Text>
          ) : null}
          <CustomTextInput
            placeholder="Email"
            value={email}
            setValue={setEmail}
            style={styles.field}
          />
          <CustomTextInput
            placeholder="Senha"
            value={password}
            setValue={setPassword}
            secureTextEntry={true}
            style={styles.field}
          />
          <PressableText
            onPress={onForgotPasswordPressed}
            text="Esqueceu sua senha ?"
            size={12}
            disabled={forgotPasswordIsOpen || registerIsOpen}
            style={styles.forgotPassword}
          />
          <CustomButton
            onPress={onLogInPressed}
            title="Log In"
            disabled={forgotPasswordIsOpen || registerIsOpen}
            style={styles.logInBtn}
          />
          <View style={styles.register}>
            <Text
              style={[styles.text, { fontFamily: 'SourceSansPro_400Regular' }]}
            >
              Não tem uma conta ?
            </Text>
            <PressableText
              onPress={onRegisterPressed}
              text="Registre - se"
              size={14}
              disabled={forgotPasswordIsOpen || registerIsOpen}
            />
          </View>
          <Text
            style={[
              styles.text,
              {
                fontFamily: 'SourceSansPro_400Regular',
                marginTop: '4%',
              },
            ]}
          >
            Ou logue com
          </Text>
          <View style={styles.socialLogIn}>
            <CircleButton
              onpress={onGoogleLoginPressed}
              icon="google"
              disabled={forgotPasswordIsOpen || registerIsOpen}
            />
            <CircleButton
              onpress={onFacebookLoginPressed}
              icon="facebook"
              disabled={forgotPasswordIsOpen || registerIsOpen}
            />
          </View>
          {registerIsOpen ? (
            <RegisterView
              ViewIsOpen={setRegisterIsOpen}
              setShowAlert={setShowAlert}
              setAlertMsg={setAlertMsg}
            />
          ) : null}
          {forgotPasswordIsOpen ? (
            <ForgotPasswordView
              ViewIsOpen={setforgotPasswordIsOpen}
              setShowAlert={setShowAlert}
              setAlertMsg={setAlertMsg}
            />
          ) : null}
          <CustomAlert
            msg={alertMsg}
            showAlert={showAlert}
            setShowAlert={setShowAlert}
          />
        </View>
      </KeyboardAwareScrollView>
      {isConnected ? null : <NoConnection />}
    </View>
  )
}

export default LoginScreen
