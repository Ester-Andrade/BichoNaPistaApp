import React, { createContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsConnected } from 'react-native-offline'
import PcIP from '../config/MyPcIp'

export const RegistrationContext = createContext()

export const RegistrationProvider = ({ children }) => {
  const [registrationQueue, setRegistrationQueue] = useState([])

  const isConnected = useIsConnected()

  const sendAttempt = (occurrence) => {
    console.log('tentativa de envio')
    if (isConnected) {
      // send() envia os dados
    } else {
      // coloca na fila
      setRegistrationQueue([...registrationQueue, {occurrence}])      
    }
  }

  const send = (occurrence, date, time, type, city, street, user, monitoring, status) => {
    console.log('enviou regstro')
  }

  useEffect(() => {
    if (isConnected) {
      registrationQueue.map((registration) => (
        // send(registration)
        console.log(registration)
      ))
    }
  }, [isConnected])

  return (
    <RegistrationContext.Provider value={{ sendAttempt, send }}>
      {children}
    </RegistrationContext.Provider>
  )
}
