import AsyncStorage from '@react-native-async-storage/async-storage'
import PcIP from '../../config/MyPcIp'

const getDataFromIP = async () => {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 3000)

  try {
    await fetch('http://' + PcIP + ':3000/formaMonitoramento', {signal: controller.signal})
      .then((response) => response.json())
      .then((body) => {
        AsyncStorage.setItem('formaMonitoramento', JSON.stringify(body))
      })
  } catch (e) {
    console.log(
      'Ocorreu um erro ao se conectar ao servidor, tente novamente mais tarde.'
    )
  }
}

const getData = async (isConnected, setData) => {
  if (isConnected) {
    await getDataFromIP()
  }

  try {
    const data = await AsyncStorage.getItem('formaMonitoramento')
    await setData(JSON.parse(data))
  } catch (e) {
    console.log('gettingData in error ', e)
  }

  return
}

export default getData