import AsyncStorage from '@react-native-async-storage/async-storage'
import PcIP from '../../config/MyPcIp'

const getDataFromIP = async () => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 3000);

  try {
    await Promise.all([
      fetch('http://' + PcIP + ':3000/grupoTax', { signal: controller.signal }),
      fetch('http://' + PcIP + ':3000/especie', { signal: controller.signal }),
      fetch('http://' + PcIP + ':3000/destinoAnimal', { signal: controller.signal }),
      fetch('http://' + PcIP + ':3000/instituDepositaria', { signal: controller.signal }),
      fetch('http://' + PcIP + ':3000/sentido', { signal: controller.signal }),
      fetch('http://' + PcIP + ':3000/divPistas', { signal: controller.signal }),
      fetch('http://' + PcIP + ':3000/pavimento', { signal: controller.signal }),
      fetch('http://' + PcIP + ':3000/vegetacao', { signal: controller.signal }),
      fetch('http://' + PcIP + ':3000/encontradoEm', { signal: controller.signal }),
    ])
      .then(([resGT, resE, resDA, resID, resS, resDP, resP, resV, resEE]) =>
        Promise.all([
          resGT.json(),
          resE.json(),
          resDA.json(),
          resID.json(),
          resS.json(),
          resDP.json(),
          resP.json(),
          resV.json(),
          resEE.json(),
        ])
      )
      .then(
        ([dataGT, dataE, dataDA, dataID, dataS, dataDP, dataP, dataV, dataEE]) => {
          AsyncStorage.setItem('grupoTaxonomico', JSON.stringify(dataGT))
          AsyncStorage.setItem('especie', JSON.stringify(dataE))
          AsyncStorage.setItem('destinoAnimal', JSON.stringify(dataDA))
          AsyncStorage.setItem('instituicaoDepositaria', JSON.stringify(dataID))
          AsyncStorage.setItem('sentido', JSON.stringify(dataS))
          AsyncStorage.setItem('tipoDivisaoPistas', JSON.stringify(dataDP))
          AsyncStorage.setItem('tipoPavimento', JSON.stringify(dataP))
          AsyncStorage.setItem('vegetacaoEntorno', JSON.stringify(dataV))
          AsyncStorage.setItem('encontradoEm', JSON.stringify(dataEE))
        }
      )
  } catch (e) {
    console.log('getDataFromIP in error ', e)
  }
}

const getData = async (
  isConnected,
  setGrupTaxOp,
  setEspecieOp,
  setDestAnimalOp,
  setInstituDepositariaOp,
  setSentidoOp,
  setDivPistasOp,
  setPavimentoOp,
  setVegetacaoOp,
  setEncontradoEmOp
) => {
  if(isConnected){
    await getDataFromIP()
  }

  try {
    const dataOps = await AsyncStorage.multiGet([
      'grupoTaxonomico',
      'especie',
      'destinoAnimal',
      'instituicaoDepositaria',
      'sentido',
      'tipoDivisaoPistas',
      'tipoPavimento',
      'vegetacaoEntorno',
      'encontradoEm',
    ])
    await setGrupTaxOp(JSON.parse(dataOps[0][1]))
    await setEspecieOp(JSON.parse(dataOps[1][1]))
    await setDestAnimalOp(JSON.parse(dataOps[2][1]))
    await setInstituDepositariaOp(JSON.parse(dataOps[3][1]))
    await setSentidoOp(JSON.parse(dataOps[4][1]))
    await setDivPistasOp(JSON.parse(dataOps[5][1]))
    await setPavimentoOp(JSON.parse(dataOps[6][1]))
    await setVegetacaoOp(JSON.parse(dataOps[7][1]))
    await setEncontradoEmOp(JSON.parse(dataOps[8][1]))
  } catch (e) {
    console.log('gettingData in error ', e)
  }

  return;
}

export default getData