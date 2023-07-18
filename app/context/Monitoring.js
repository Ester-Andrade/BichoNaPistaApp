import React, { createContext, useEffect, useState, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsConnected } from 'react-native-offline'
import { AuthContext } from './Auth'
import { RegistrationContext } from './Registration'
import * as Location from 'expo-location'
import PcIP from '../config/MyPcIp'

export const MonitoringContext = createContext()

export const MonitoringProvider = ({ children }) => {
  const { userToken } = useContext(AuthContext)
  const { send } = useContext(RegistrationContext)

  const [inMonitoring, setInMonitoring] = useState(false)
  const [finished, setFinished] = useState(false)
  const [initialLatitude, setInitialLatitude] = useState(null)
  const [initialLongitude, setInitialLongitude] = useState(null)
  const [initialPlace, setInitialPlace] = useState('')
  const [finalLatitude, setFinalLatitude] = useState(null)
  const [finalLongitude, setFinalLongitude] = useState(null)
  const [finalPlace, setFinalPlace] = useState('')
  const [initialDateTime, setInitialDateTime] = useState(null)
  const [finalDateTime, setFinalDateTime] = useState(null)
  const [nPeople, setNPeople] = useState('')
  const [mode, setMode] = useState(null)
  const [speed, setSpeed] = useState('')
  const [descr, setDescr] = useState('')
  const [occurrences, setOccurrences] = useState([])

  const isConnected = useIsConnected()

  const start = async (setAlertMsg, setShowAlert) => {
    try {
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      })
      setInitialLatitude(latitude)
      setInitialLongitude(longitude)

      const place = await Location.reverseGeocodeAsync({
        latitude: latitude,
        longitude: longitude,
      })
      setInitialPlace(
        place[0].street +
          ' - ' +
          place[0].district +
          ', ' +
          place[0].subregion +
          ' - ' +
          place[0].region
      )

      setInitialDateTime(new Date())
      setInMonitoring(true)
    } catch (error) {
      setAlertMsg(
        'Não é possível prosseguir sem a localização! \n\nVerifique se o GPS está ligado.'
      )
      setShowAlert(true)
    }
  }

  const finalize = async () => {
    try {
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      })
      setFinalLatitude(latitude)
      setFinalLongitude(longitude)

      const place = await Location.reverseGeocodeAsync({
        latitude: latitude,
        longitude: longitude,
      })
      setFinalPlace(
        place[0].street +
          ' - ' +
          place[0].district +
          ', ' +
          place[0].subregion +
          ' - ' +
          place[0].region
      )

      setFinalDateTime(new Date())
      setInMonitoring(false)
      setFinished(true)
    } catch (error) {
      setAlertMsg(
        'Não é possível prosseguir sem a localização! \n\nVerifique se o GPS está ligado.'
      )
      setShowAlert(true)
    }
  }

  const addOccurrence = (occurrence, setAlertMsg, setShowAlert) => {
    setOccurrences([...occurrences, occurrence])
    setAlertMsg(
      'Existe um monitoramento em andamento! \n\nSeu registro será enviado juntamente com o monitoramento a qual pertence.'
    )
    setShowAlert(true)
  }

  const clearMonitoringVar = () => {
    setInMonitoring(false)
    setFinished(false)
    setInitialLatitude(null)
    setInitialLongitude(null)
    setInitialPlace('')
    setFinalLatitude(null)
    setFinalLongitude(null)
    setFinalPlace('')
    setInitialDateTime(null)
    setFinalDateTime(null)
    setNPeople('')
    setMode(null)
    setSpeed('')
    setDescr('')
    setOccurrences([])
  }

  const sendAttempt = async (setAlertMsg, setShowAlert, setSendingData) => {
    if (isConnected) {
      setSendingData(true)
      await sendM(
        initialLatitude,
        initialLongitude,
        finalLatitude,
        finalLongitude,
        initialDateTime,
        finalDateTime,
        userToken,
        nPeople,
        mode,
        speed,
        descr,
        occurrences
      )
      setSendingData(false)
      setAlertMsg('Monitoramento salvo com sucesso!')
      setShowAlert(true)
    } else {
      let monitoringQueue = await AsyncStorage.getItem('monitoringQueue')
      if (monitoringQueue == null) {
        AsyncStorage.setItem(
          'monitoringQueue',
          JSON.stringify([
            [
              initialLatitude,
              initialLongitude,
              finalLatitude,
              finalLongitude,
              initialDateTime,
              finalDateTime,
              userToken,
              nPeople,
              mode,
              speed,
              descr,
              occurrences,
            ],
          ])
        )
      } else {
        monitoringQueue = JSON.parse(monitoringQueue)
        monitoringQueue.push([
          initialLatitude,
          initialLongitude,
          finalLatitude,
          finalLongitude,
          initialDateTime,
          finalDateTime,
          userToken,
          nPeople,
          mode,
          speed,
          descr,
          occurrences,
        ])
        AsyncStorage.setItem('monitoringQueue', JSON.stringify(monitoringQueue))
      }
      setAlertMsg(
        'Você está sem conexão à internet! \n\nSeu monitoramento será salvo assim que a conexão for restaurada, ou da próxima vez que abrir o app com conexão.'
      )
      setShowAlert(true)
    }
    clearMonitoringVar()
  }

  const sendM = async (
    latitudeI,
    longitudeI,
    latitudeF,
    longitudeF,
    iDateTime,
    fDateTime,
    user,
    nPeople,
    monitoring,
    speed,
    descr,
    occurrences
  ) => {
    const iDateTime2 = new Date(iDateTime)
    const iDate =
      iDateTime2.getFullYear() +
      '-' +
      (iDateTime2.getMonth() + 1) +
      '-' +
      iDateTime2.getDate()
    const iTime =
      iDateTime2.getHours() +
      ':' +
      iDateTime2.getMinutes() +
      ':' +
      iDateTime2.getSeconds()
    const fDateTime2 = new Date(fDateTime)
    const fDate =
      fDateTime2.getFullYear() +
      '-' +
      (fDateTime2.getMonth() + 1) +
      '-' +
      fDateTime2.getDate()
    const fTime =
      fDateTime2.getHours() +
      ':' +
      fDateTime2.getMinutes() +
      ':' +
      fDateTime2.getSeconds()

    // communication with the server
    try {
      await fetch('http://' + PcIP + ':3000/monitoring', {
        method: 'POST',
        body: JSON.stringify({
          latitudeI: latitudeI,
          longitudeI: longitudeI,
          latitudeF: latitudeF,
          longitudeF: longitudeF,
          iDate: iDate,
          fDate: fDate,
          iTime: iTime,
          fTime: fTime,
          user: user,
          nPeople: nPeople,
          monitoring: monitoring,
          speed: speed,
          descr: descr,
        }),
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((body) => {
          occurrences.map(async (occurrence) => {
            await send(
              occurrence[0],
              occurrence[1],
              'Sistemático',
              occurrence[2],
              occurrence[3],
              occurrence[4],
              body.ID
            )
          })
        })
    } catch (e) {
      console.log(
        'Ocorreu um erro ao se conectar ao servidor, tente novamente mais tarde'
      )
    }
  }

  useEffect(() => {
    ;(async () => {
      if (isConnected) {
        let monitoringQueue = await AsyncStorage.getItem('monitoringQueue')
        if (monitoringQueue != null) {
          monitoringQueue = JSON.parse(monitoringQueue)
          monitoringQueue.map(
            async (monitoring) =>
              await sendM(
                monitoring[0],
                monitoring[1],
                monitoring[2],
                monitoring[3],
                monitoring[4],
                monitoring[5],
                monitoring[6],
                monitoring[7],
                monitoring[8],
                monitoring[9],
                monitoring[10],
                monitoring[11]
              )
          )
          AsyncStorage.removeItem('monitoringQueue')
        }
      }
    })()
  }, [isConnected])

  return (
    <MonitoringContext.Provider
      value={{
        inMonitoring,
        finished,
        initialPlace,
        finalPlace,
        initialDateTime,
        finalDateTime,
        nPeople,
        setNPeople,
        mode,
        setMode,
        speed,
        setSpeed,
        descr,
        setDescr,
        start,
        finalize,
        addOccurrence,
        clearMonitoringVar,
        sendAttempt,
      }}
    >
      {children}
    </MonitoringContext.Provider>
  )
}
