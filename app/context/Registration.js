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
    animalName,
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
          JSON.stringify([
            [occurrence, dateTime, city, street, user, animalName],
          ])
        )
      } else {
        registrationQueue = JSON.parse(registrationQueue)
        registrationQueue.push([
          occurrence,
          dateTime,
          city,
          street,
          user,
          animalName,
        ])
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

  const uploadAttempt = async (
    ID,
    destination,
    status,
    setAlertMsg,
    setShowAlert,
    setSendingData
  ) => {
    const newStatus = destination.includes(1) ? status : status.split(' e ')[0]
    if (isConnected) {
      setSendingData(true)
      await upload(ID, destination, newStatus)
      setSendingData(false)
      setAlertMsg('Registro atualizado com sucesso!')
      setShowAlert(true)
    } else {
      let uploadQueue = await AsyncStorage.getItem('uploadQueue')
      if (uploadQueue == null) {
        AsyncStorage.setItem(
          'uploadQueue',
          JSON.stringify([[ID, destination, newStatus]])
        )
      } else {
        uploadQueue = JSON.parse(uploadQueue)
        uploadQueue.push([ID, destination, newStatus])
        AsyncStorage.setItem('uploadQueue', JSON.stringify(uploadQueue))
      }
      setAlertMsg(
        'Você está sem conexão à internet! \n\nSeu registro será atualizado assim que a conexão for restaurada, ou da próxima vez que abrir o app com conexão.'
      )
      setShowAlert(true)
    }
  }

  const upload = async (ID, destination, status) => {
    try {
      await fetch('http://' + PcIP + ':3000/upload', {
        method: 'POST',
        body: JSON.stringify({
          id: ID,
          destinacao: destination,
          status: status,
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
        'Ocorreu um erro ao se conectar ao servidor, tente novamente mais tarde. \n\n Erro: '+ e
      )
    }
  }

  const uploadLocalData = async (
    ID,
    destination,
    setAlertMsg,
    setShowAlert,
    setSendingData
  ) => {
    setSendingData(true)
    let registrationQueue = await AsyncStorage.getItem('registrationQueue')
    registrationQueue = JSON.parse(registrationQueue)
    registrationQueue.map(async (registration, i) => {
      if (i == ID) {
        registration[0].destinacao = destination
      }
    })
    AsyncStorage.setItem('registrationQueue', JSON.stringify(registrationQueue))
    setSendingData(false)
    setAlertMsg(
      'Você alterou um registro que está aguardando conexão para ser enviado! \n\nEle será enviado com a alteração realizada assim que a conexão for restaurada.'
    )
    setShowAlert(true)
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

        let uploadQueue = await AsyncStorage.getItem('uploadQueue')
        if (uploadQueue != null) {
          uploadQueue = JSON.parse(uploadQueue)
          uploadQueue.map(
            async (item) => await upload(item[0], item[1], item[2])
          )
          AsyncStorage.removeItem('uploadQueue')
        }
      }
    })()
  }, [isConnected])

  return (
    <RegistrationContext.Provider
      value={{ sendAttempt, send, uploadAttempt, uploadLocalData }}
    >
      {children}
    </RegistrationContext.Provider>
  )
}
