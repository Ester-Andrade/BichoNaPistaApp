import React, { useContext } from 'react'
import { ScrollView, View, Text } from 'react-native'
import {
  useFonts,
  SourceSansPro_400Regular,
  SourceSansPro_300Light,
} from '@expo-google-fonts/source-sans-pro'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useIsConnected } from 'react-native-offline'
import CustomHeader from '../../components/CustomHeader'
import CustomButton from '../../components/CustomButton'
import CustomTextInput from '../../components/CustomTextInput'
import CustomDropDown from '../../components/CustomDropDown'
import CustomDivider from '../../components/CustomDivider'
import CustomTextArea from '../../components/CustomTextArea'
import NoConnection from '../../components/NoConnection'
import colors from '../../config/styles'
import styles from './styles'

const RegistrationScreen = () => {
  const MoniOp = [{ op: 'Sim' }, { op: 'Não' }, { op: 'Não sei' }]

  const isConnected = useIsConnected()

  let [fontsLoaded] = useFonts({
    SourceSansPro_400Regular,
    SourceSansPro_300Light,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={styles.root}>
      <CustomHeader />
      <ScrollView
        nestedScrollEnabled={true}
        style={styles.root}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Text style={[styles.text, { fontFamily: 'SourceSansPro_400Regular' }]}>
          Duração:
        </Text>
        <Text style={[styles.timer, { fontFamily: 'SourceSansPro_300Light' }]}>
          00:00:00
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
            Estr. Rio
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
            Estr. Rio
          </Text>
        </View>
        <CustomDivider style={styles.divider1} />
        <View style={styles.hours}>
          <View style={styles.hour}>
            <Text
              style={[styles.text2, { fontFamily: 'SourceSansPro_400Regular' }]}
            >
              Hora de início
            </Text>
            <Text
              style={[
                styles.text2,
                false ? { color: colors.darkGray2 } : null,
                { fontFamily: 'SourceSansPro_400Regular' },
              ]}
            >
              00:00:00
            </Text>
            <Text
              style={[styles.text2, { fontFamily: 'SourceSansPro_400Regular' }]}
            >
              hh:mm:ss
            </Text>
          </View>
          <View style={styles.hour}>
            <Text
              style={[styles.text2, { fontFamily: 'SourceSansPro_400Regular' }]}
            >
              Hora de término
            </Text>
            <Text
              style={[
                styles.text2,
                false ? { color: colors.darkGray2 } : null,
                { fontFamily: 'SourceSansPro_400Regular' },
              ]}
            >
              00:00:00
            </Text>
            <Text
              style={[styles.text2, { fontFamily: 'SourceSansPro_400Regular' }]}
            >
              hh:mm:ss
            </Text>
          </View>
        </View>
        <CustomDivider style={styles.divider2} />
        <CustomButton
          onPress={() => console.log('pressei')}
          title="Iniciar monitoramento" // 'Encerrar monitoramento'
          disabled={false}
          style={styles.button}
        />
        <CustomDropDown
          data={MoniOp}
          placeholder="Monitoramento realizado"
          label="Monitoramento realizado"
          value={null}
          setValue={(value) => console.log(value)}
          wShow="op"
          wSave="op"
          touched={() => setFieldTouched('lago_rio_riacho')}
          style={styles.finalFields}
        />
        <CustomTextInput
          placeholder="N° pessoas monitorando:"
          label="N° pessoas monitorando:"
          value={''}
          setValue={(value) => console.log(value)}
          style={[styles.finalFields, {marginTop: 3}]}
        />
        <CustomTextInput
          placeholder="Velocidade do monitoramento (km/h):"
          label="Velocidade do monitoramento (km/h):"
          value={''}
          setValue={(value) => console.log(value)}
          style={[styles.finalFields, {marginTop: 4}]}
        />
        <CustomTextArea
          label={' Descrição do monitoramento '}
          value={null}
          setValue={(value) => console.log(value)}
          nLines={4}
          style={styles.txtArea}
        />
        <CustomButton
          onPress={() => console.log('pressei')}
          title="Salvar monitoramento"
          disabled={false}
          style={styles.button2}
        />
      </ScrollView>
      {isConnected ? null : <NoConnection />}
    </View>
  )
}

export default RegistrationScreen
