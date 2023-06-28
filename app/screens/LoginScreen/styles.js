import { StyleSheet, Dimensions } from 'react-native'
import colors from '../../config/styles'
import scale from '../../config/HeightScale'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  logo: {
    width: Dimensions.get('window').width * 0.33,
    height: Dimensions.get('window').height * 0.25,
    marginTop: '14%',
  },
  fail: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: -30 * scale,
    paddingHorizontal: 5 * scale,
    color: colors.red,
    fontSize: 13 * scale,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.red,
  },
  keyboard: {
    height: '100%',
    width: '100%',
  },
  field: {
    marginTop: '6%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginRight: '14%',
    marginTop: '1%',
  },
  logInBtn: {
    marginTop: '12%',
  },
  text: {
    fontSize: 14 * scale,
    color: colors.gray,
  },
  register: {
    flexDirection: 'row',
    marginTop: '6%',
  },
  socialLogIn: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
})

export default styles
