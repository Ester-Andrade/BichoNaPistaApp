import React, { createContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsConnected } from 'react-native-offline'
import PcIP from '../config/MyPcIp'

export const MonitoringContext = createContext()

export const MonitoringProvider = ({ children }) => {
  const [monitoringQueue, setMonitoringQueue] = useState([])

  const isConnected = useIsConnected()

  const start = () => {
    console.log('começu monitoramento')
  }

  const finalize = () => {
    console.log('terminou monitoramento')
  }

  const sendAttempt = () => {
    console.log('tentativa de envio')
    if (isConnected) {
      // send() envia os dados
    } else {
      // coloca na fila
    }
  }

  const send = () => {
    console.log('enviou monitoramento')
  }

  useEffect(() => {
    if (isConnected) {
      
    }
  }, [isConnected])

  return (
    <MonitoringContext.Provider value={{ start, finalize, sendAttempt }}>
      {children}
    </MonitoringContext.Provider>
  )
}
