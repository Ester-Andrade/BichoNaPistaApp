import React, { createContext, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsConnected } from 'react-native-offline'
import { AuthContext } from './Auth'
import PcIP from '../config/MyPcIp'

export const RegistrationContext = createContext()

export const RegistrationProvider = ({ children }) => {
  const { nRegs, setNregs } = useContext(AuthContext)

  const isConnected = useIsConnected()

  const sendAttempt = async (
    occurrence,
    dateTime,
    city,
    street,
    user,
    setAlertMsg,
    setShowAlert,
    setSendingData
  ) => {
    if (isConnected) {
      setSendingData(true)
      await send(occurrence, dateTime, 'Pontual', city, street, user, null)
      setSendingData(false)
      setAlertMsg('Registro enviado com sucesso!')
      setShowAlert(true)
    } else {
      let registrationQueue = await AsyncStorage.getItem('registrationQueue')
      if (registrationQueue == null) {
        AsyncStorage.setItem(
          'registrationQueue',
          JSON.stringify([[occurrence, dateTime, city, street, user]])
        )
      } else {
        registrationQueue = JSON.parse(registrationQueue)
        registrationQueue.push([occurrence, dateTime, city, street, user])
        AsyncStorage.setItem(
          'registrationQueue',
          JSON.stringify(registrationQueue)
        )
      }
      setAlertMsg(
        'Você está sem conexão à internet! \n\nSeu registro foi adicionado a fila e será enviado assim que a conexão for restaurada, ou da próxima vez que abrir o app com conexão.'
      )
      setShowAlert(true)
    }
  }

  const send = async (
    occurrence,
    dateTime,
    type,
    city,
    street,
    user,
    monitoring
  ) => {
    const dateTime2 = new Date(dateTime)
    const date =
      dateTime2.getFullYear() +
      '-' +
      (dateTime2.getMonth() + 1) +
      '-' +
      dateTime2.getDate()
    const time =
      dateTime2.getHours() +
      ':' +
      dateTime2.getMinutes() +
      ':' +
      dateTime2.getSeconds()
    var occuStatus

    if (occurrence.destinacao.indexOf(1) === -1) {
      occuStatus = 'Em análise'
    } else {
      occuStatus = 'Em análise e a complementar'
    }

    let photoName =
      date.replace(/[^0-9]/g, '') + '_' + time.replace(/[^0-9]/g, '')
    occurrence.photo1 = await sendPhoto(
      photoName + '_p1' + user,
      occurrence.photo1
    )
    if (occurrence.photo2 != null) {
      occurrence.photo2 = await sendPhoto(
        photoName + '_p2' + user,
        occurrence.photo2
      )
    }
    if (occurrence.photo3 != null) {
      occurrence.photo3 = await sendPhoto(
        photoName + '_p3' + user,
        occurrence.photo3
      )
    }

    // communication with the server
    try {
      await fetch('http://' + PcIP + ':3000/occurrence', {
        method: 'POST',
        body: JSON.stringify({
          occurrence: occurrence,
          date: date,
          time: time,
          type: type,
          city: city,
          street: street,
          user: user,
          monitoring: monitoring,
          occuStatus: occuStatus,
        }),
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((body) => {
          console.log(body)
        })
    } catch (e) {
      console.log(
        'Ocorreu um erro ao se conectar ao servidor, tente novamente mais tarde'
      )
    }
    setNregs(nRegs + 1)
  }

  // Send photo to s3
  const sendPhoto = async (photoName, photoUri) => {
    fetch('http://' + PcIP + ':3000/sendPhoto', {
      method: 'POST',
      body: JSON.stringify({
        photoName: photoName,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((body) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', body.link)
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              console.log('Image successfully uploaded to S3')
            } else {
              console.log('Error while sending the image to S3')
            }
          }
        }
        xhr.setRequestHeader('Content-Type', 'image/jpeg')
        xhr.send({
          uri: photoUri,
          type: 'image/jpeg',
          name: photoName + '.jpg',
        })
      })
    return (
      'https://bicho-na-pista-bucket.s3.sa-east-1.amazonaws.com/images/' +
      photoName +
      '.jpg'
    )
  }

  useEffect(() => {
    ;(async () => {
      if (isConnected) {
        let registrationQueue = await AsyncStorage.getItem('registrationQueue')
        if (registrationQueue != null) {
          registrationQueue = JSON.parse(registrationQueue)
          registrationQueue.map(
            async (registration) =>
              await send(
                registration[0],
                registration[1],
                'Pontual',
                registration[2],
                registration[3],
                registration[4],
                null
              )
          )
          AsyncStorage.removeItem('registrationQueue')
        }
      }
    })()
  }, [isConnected])

  return (
    <RegistrationContext.Provider value={{ sendAttempt, send }}>
      {children}
    </RegistrationContext.Provider>
  )
}
