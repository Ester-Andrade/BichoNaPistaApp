import React, { useState, useEffect, useContext } from 'react'
import { ScrollView, View, Text, ActivityIndicator } from 'react-native'
import {
  useFonts,
  SourceSansPro_400Regular,
  SourceSansPro_400Regular_Italic,
  SourceSansPro_300Light,
} from '@expo-google-fonts/source-sans-pro'
import { useIsConnected } from 'react-native-offline'
import { MonitoringContext } from '../../context/Monitoring'
import CustomHeader from '../../components/CustomHeader'
import CustomButton from '../../components/CustomButton'
import CustomTextInput from '../../components/CustomTextInput'
import CustomDropDown from '../../components/CustomDropDown'
import CustomDivider from '../../components/CustomDivider'
import CustomTextArea from '../../components/CustomTextArea'
import CustomAlert from '../../components/CustomAlert'
import NoConnection from '../../components/NoConnection'
import getData from './MonitoringScreenContainer'
import colors from '../../config/styles'
import styles from './styles'
import moment from 'moment'

const MonitoringScreen = ({ navigation }) => {
  const {
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
    sendAttempt,
  } = useContext(MonitoringContext)

  const [gettingData, setGettingData] = useState(true)
  const [sendingData, setSendingData] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState(true)
  const [MoniOp, setMoniOp] = useState([])
  const [time, setTime] = useState(0)

  const isConnected = useIsConnected()

  useEffect(() => {
    ;(async () => {
      await getData(isConnected, setMoniOp)

      setGettingData(false)
    })()

    if (finished) {
      setTime(
        Math.floor(
          moment(finalDateTime, 'DD/MM/YYYY HH:mm:ss').diff(moment(initialDateTime, 'DD/MM/YYYY HH:mm:ss')) / 1000
        )
      )      
    }

    let interval = null

    if (inMonitoring) {
      setTime(
        Math.floor(
          moment().diff(moment(initialDateTime, 'DD/MM/YYYY HH:mm:ss')) / 1000
        )
      )

      interval = setInterval(() => {
        setTime((time) => time + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => {
      clearInterval(interval)
    }
  }, [inMonitoring])

  const timer = () => {
    var sec = time % 60
    var min = Math.floor(time / 60)
    var hour = Math.floor(time / 3600)

    return (
      ('00' + hour).slice(-2) +
      ':' +
      ('00' + min).slice(-2) +
      ':' +
      ('00' + sec).slice(-2)
    )
  }

  let [fontsLoaded] = useFonts({
    SourceSansPro_400Regular,
    SourceSansPro_400Regular_Italic,
    SourceSansPro_300Light,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={styles.root}>
      <CustomHeader />
      {gettingData || sendingData ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size={'large'} color={colors.yellow} />
        </View>
      ) : (
        <ScrollView
          nestedScrollEnabled={true}
          style={styles.root}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Text
            style={[styles.text, { fontFamily: 'SourceSansPro_400Regular' }]}
          >
            Duração:
          </Text>
          <Text
            style={[styles.timer, { fontFamily: 'SourceSansPro_300Light' }]}
          >
            {timer()}
          </Text>
          <View style={styles.field}>
            <Text
              style={[
                styles.fieldLabel,
                { fontFamily: 'SourceSansPro_400Regular' },
              ]}
            >
              Local inicial:
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.fieldContent,
                { fontFamily: 'SourceSansPro_400Regular' },
              ]}
            >
              {initialPlace}
            </Text>
          </View>
          <View style={styles.field}>
            <Text
              style={[
                styles.fieldLabel,
                { fontFamily: 'SourceSansPro_400Regular' },
              ]}
            >
              Local final:
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.fieldContent,
                { fontFamily: 'SourceSansPro_400Regular' },
              ]}
            >
              {finalPlace}
            </Text>
          </View>
          <CustomDivider style={styles.divider1} />
          <View style={styles.hours}>
            <View style={styles.hour}>
              <Text
                style={[
                  styles.text2,
                  { fontFamily: 'SourceSansPro_400Regular' },
                ]}
              >
                Hora de início
              </Text>
              <Text
                style={[
                  styles.text2,
                  inMonitoring || finished ? { color: colors.darkGray2 } : null,
                  { fontFamily: 'SourceSansPro_400Regular' },
                ]}
              >
                {inMonitoring || finished
                  ? ('00' + initialDateTime.getHours()).slice(-2) +
                    ':' +
                    ('00' + initialDateTime.getMinutes()).slice(-2) +
                    ':' +
                    ('00' + initialDateTime.getSeconds()).slice(-2)
                  : '00:00:00'}
              </Text>
              <Text
                style={[
                  styles.text2,
                  { fontFamily: 'SourceSansPro_400Regular' },
                ]}
              >
                hh:mm:ss
              </Text>
            </View>
            <View style={styles.hour}>
              <Text
                style={[
                  styles.text2,
                  { fontFamily: 'SourceSansPro_400Regular' },
                ]}
              >
                Hora de término
              </Text>
              <Text
                style={[
                  styles.text2,
                  finished ? { color: colors.darkGray2 } : null,
                  { fontFamily: 'SourceSansPro_400Regular' },
                ]}
              >
                {finished
                  ? ('00' + finalDateTime.getHours()).slice(-2) +
                    ':' +
                    ('00' + finalDateTime.getMinutes()).slice(-2) +
                    ':' +
                    ('00' + finalDateTime.getSeconds()).slice(-2)
                  : '00:00:00'}
              </Text>
              <Text
                style={[
                  styles.text2,
                  { fontFamily: 'SourceSansPro_400Regular' },
                ]}
              >
                hh:mm:ss
              </Text>
            </View>
          </View>
          <CustomDivider style={styles.divider2} />
          <CustomButton
            onPress={() =>
              inMonitoring ? finalize() : start(setAlertMsg, setShowAlert)
            }
            title={
              !inMonitoring && !finished
                ? 'Iniciar monitoramento'
                : 'Encerrar monitoramento'
            }
            disabled={finished}
            style={styles.button}
          />
          <CustomDropDown
            data={MoniOp}
            placeholder="Monitoramento realizado"
            label="Monitoramento realizado"
            value={mode}
            setValue={(value) => setMode(value)}
            wShow="DescrFormaMonitoramento"
            wSave="CodFormaMonitoramento"
            style={styles.finalFields}
          />
          <CustomTextInput
            placeholder="N° pessoas monitorando:"
            label="N° pessoas monitorando:"
            value={nPeople}
            setValue={(value) => setNPeople(value)}
            style={[styles.finalFields, { marginTop: 3 }]}
          />
          {/^[0-9]+$/.test(nPeople) || nPeople === '' ? null : (
            <Text
              style={[
                styles.errors,
                {
                  fontFamily: 'SourceSansPro_400Regular_Italic',
                },
              ]}
            >
              Deve usar apenas dígitos.
            </Text>
          )}
          <CustomTextInput
            placeholder="Velocidade do monitoramento (km/h):"
            label="Velocidade do monitoramento (km/h):"
            value={speed}
            setValue={(value) => setSpeed(value)}
            style={[styles.finalFields, { marginTop: 4 }]}
          />
          {/^[0-9]+$/.test(speed) || speed === '' ? null : (
            <Text
              style={[
                styles.errors,
                {
                  fontFamily: 'SourceSansPro_400Regular_Italic',
                },
              ]}
            >
              Deve usar apenas dígitos.
            </Text>
          )}
          <CustomTextArea
            label={' Descrição do monitoramento '}
            value={descr}
            setValue={(value) => setDescr(value)}
            nLines={4}
            style={styles.txtArea}
          />
          <CustomButton
            onPress={() =>
              sendAttempt(setAlertMsg, setShowAlert, setSendingData)
            }
            title="Salvar monitoramento"
            disabled={
              !(
                finished &&
                mode !== null &&
                nPeople !== '' &&
                /^[0-9]+$/.test(nPeople) &&
                speed !== '' &&
                /^[0-9]+$/.test(speed)
              )
            }
            style={styles.button2}
          />
        </ScrollView>
      )}
      <CustomAlert
        msg={alertMsg}
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        onPress={() => inMonitoring ? setShowAlert(false) : navigation.goBack()}
      />
      {isConnected ? null : <NoConnection />}
    </View>
  )
}

export default MonitoringScreen
