import { Dimensions, StyleSheet } from 'react-native'
import colors from '../../config/styles'
import scale from '../../config/HeightScale'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.white,
  },
  text: {
    marginLeft: Dimensions.get('screen').width * 0.083,
    marginTop: Dimensions.get('screen').width * 0.083,
    color: colors.gray2,
    fontSize: 12 * scale,
  },
  timer: {
    alignSelf: 'center',
    color: colors.darkGray2,
    marginBottom: Dimensions.get('screen').width * 0.042,
    fontSize: 48 * scale,
  },
  field: {
    height: Dimensions.get('screen').width * 0.1222,
    width: Dimensions.get('screen').width * 0.834,
    marginTop: Dimensions.get('screen').width * 0.042,
    backgroundColor: colors.ligthGray,
    alignSelf: 'center',
    borderRadius: 9,
  },
  fieldLabel: {
    marginLeft: '8.36%',
    marginTop: 5 * scale,
    color: colors.gray2,
    fontSize: 12 * scale,
  },
  fieldContent: {
    marginHorizontal: '4.68%',
    color: colors.darkGray2,
    fontSize: 12 * scale,
  },
  divider1: {
    marginTop: Dimensions.get('screen').width * 0.094,
    width: Dimensions.get('screen').width * 0.894,
    alignSelf: 'center',
  },
  divider2: {
    marginBottom: Dimensions.get('screen').width * 0.094,
    width: Dimensions.get('screen').width * 0.894,
    alignSelf: 'center',
  },
  hours: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  hour: {
    alignItems: 'center',
  },
  text2: {
    color: colors.gray2,
    fontSize: 12 * scale,
  },
  button: {
    alignSelf: 'center',
    marginBottom: Dimensions.get('screen').width * 0.05,
  },
  finalFields: {
    width: '83.33%',
    alignSelf: 'center',
  },
  txtArea: {
    width: '83.33%',
    alignSelf: 'center',
    marginBottom: Dimensions.get('screen').width * 0.12,
    marginTop: Dimensions.get('screen').width * 0.12,
  },
  button2: {
    alignSelf: 'center',
    marginBottom: Dimensions.get('screen').width * 0.2,
  },
})

export default styles
