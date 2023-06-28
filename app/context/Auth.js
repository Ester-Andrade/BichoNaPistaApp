import React, { createContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PcIP from '../config/MyPcIp'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [userToken, setUserToken] = useState(null)
  const [userName, setUserName] = useState(null)
  const [userType, setUserType] = useState(null)

  const logIn = (email, password, setLoginFail) => {
    setIsLoading(true)
    fetch('http://' + PcIP + ':3000/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.loginFail) {
          setLoginFail(true)
        } else {
          let userInfo = body.result[0]
          let name = userInfo.NomeCompleto
          name = name.split(' ')
          name = name[0] + ' ' + name[name.length - 1]
          setUserToken(userInfo.CodUsuario)
          setUserName(name)
          setUserType(userInfo.Perfil)
          AsyncStorage.setItem('userToken', JSON.stringify(userInfo.CodUsuario))
          AsyncStorage.setItem('userName', name)
          AsyncStorage.setItem('userType', JSON.stringify(userInfo.Perfil))
        }
      })
    setIsLoading(false)
  }

  const logOut = () => {
    setIsLoading(true)
    setUserToken(null)
    setUserName(null)
    setUserType(null)
    AsyncStorage.removeItem('userToken')
    AsyncStorage.removeItem('userName')
    AsyncStorage.removeItem('userType')
    setIsLoading(false)
  }

  const isLoggedIn = async () => {
    try {
      setIsLoading(true)
      let userToken = await AsyncStorage.getItem('userToken')
      setUserToken(JSON.parse(userToken))
      let userName = await AsyncStorage.getItem('userName')
      setUserName(userName)
      let userType = await AsyncStorage.getItem('userType')
      setUserType(JSON.parse(userType))
      setIsLoading(false)
    } catch (e) {
      console.log('isLogged in error ', e)
    }
  }

  useEffect(() => {
    isLoggedIn()
  }, [])

  return (
    <AuthContext.Provider
      value={{ isLoading, userToken, userName, userType, logIn, logOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}
