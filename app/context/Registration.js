import React, { createContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsConnected } from 'react-native-offline'
import PcIP from '../config/MyPcIp'

export const RegistrationContext = createContext()

export const RegistrationProvider = ({ children }) => {
  const [registrationQueue, setRegistrationQueue] = useState([])

  const isConnected = useIsConnected()

  const sendAttempt = (
    occurrence,
    dateTime,
    type,
    city,
    street,
    user,
    setAlertMsg,
    setShowAlert
  ) => {
    console.log(occurrence, dateTime, type, city, street, user)
    // const regisArr = [occurrence, dateTime, type, city, street, user]
    if (isConnected) {
      // send() envia os dados
      setAlertMsg('Registro enviado com sucesso!')
      setShowAlert(true)
    } else {
      // coloca na fila
      // setRegistrationQueue([...registrationQueue, {occurrence}])
      setAlertMsg(
        'Você está sem conexão à internet! \n\nSeu registro foi adicionado a fila e será enviado assim que a conexão for restaurada, ou da próxima vez que abrir o app com conexão.'
      )
      setShowAlert(true)
    }
  }

  const send = (
    occurrence,
    date,
    time,
    type,
    city,
    street,
    user,
    monitoring,
    status
  ) => {
    console.log('enviou regstro')
  }

  useEffect(() => {
    if (isConnected) {
      registrationQueue.map((registration) =>
        // send(registration)
        console.log(registration)
      )
    }
  }, [isConnected])

  return (
    <RegistrationContext.Provider value={{ sendAttempt, send }}>
      {children}
    </RegistrationContext.Provider>
  )
}
