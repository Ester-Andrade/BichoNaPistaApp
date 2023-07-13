import React, { createContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import PcIP from '../config/MyPcIp'

export const MonitoringContext = createContext()

export const MonitoringProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [userToken, setUserToken] = useState(null)
  const [userName, setUserName] = useState(null)
  const [userType, setUserType] = useState(null)

    const start = () => {
    console.log("começu monitoramento")
  }

  const finalize = () => {
    console.log("terminou monitoramento")
  }

  const send = () => {
    console.log("enviou monitoramento")
  }

  useEffect(() => {
    console.log("contexto de monitoramento")
  }, [])

  return (
    <MonitoringContext.Provider
      value={{ start, finalize, send }}
    >
      {children}
    </MonitoringContext.Provider>
  )
}
