import React, { createContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsConnected } from 'react-native-offline'
import PcIP from '../config/MyPcIp'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [userToken, setUserToken] = useState(null)
  const [userName, setUserName] = useState(null)
  const [userType, setUserType] = useState(null)
  const [rankPos, setRankPos] = useState(null)
  const [nRegs, setNregs] = useState(null)

  const isConnected = useIsConnected()

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
          getProfileInfo(userInfo.Perfil, userInfo.CodUsuario)
        }
      })
    setIsLoading(false)
  }

  const getProfileInfo = (type, token) => {
    fetch('http://' + PcIP + ':3000/rankingPosition', {
      method: 'POST',
      body: JSON.stringify({
        type: type,
        user: token,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((body) => {
        setRankPos(body[0].RankResult)
        setNregs(body[0].NregTot)
        AsyncStorage.setItem('rankPos', JSON.stringify(body[0].RankResult))
        AsyncStorage.setItem('nRegs', JSON.stringify(body[0].NregTot))
      })
  }

  const logOut = () => {
    setIsLoading(true)
    setUserToken(null)
    setUserName(null)
    setUserType(null)
    setRankPos(null)
    setNregs(null)
    AsyncStorage.removeItem('userToken')
    AsyncStorage.removeItem('userName')
    AsyncStorage.removeItem('userType')
    AsyncStorage.removeItem('rankPos')
    AsyncStorage.removeItem('nRegs')
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
    } catch (e) {
      console.log('isLogged in error ', e)
    }
  }

  useEffect(() => {
    isLoggedIn()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (isConnected && userToken != null) {
        getProfileInfo(userType, userToken)
      } else {
        let rankPosi = await AsyncStorage.getItem('rankPos')
        setRankPos(JSON.parse(rankPosi))
        let nRegis = await AsyncStorage.getItem('nRegs')
        setNregs(JSON.parse(nRegis))
      }
      setIsLoading(false)
    })()
  }, [isConnected])

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        userName,
        userType,
        rankPos,
        setRankPos,
        nRegs,
        setNregs,
        logIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
