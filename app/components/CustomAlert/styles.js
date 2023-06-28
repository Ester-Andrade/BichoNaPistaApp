import { StyleSheet } from 'react-native'
import colors from '../../config/styles'

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000099',
  },
  modal: {
    width: '70%',
    backgroundColor: colors.white,
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 25,
    elevation: 2,
  },
  text: {
    color: colors.darkGray,
    fontSize: 16,
    textAlign: 'center',
  },
  btn: {
    width: '85%',
    height: 30,
    marginTop: 40,
    marginHorizontal: 10,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    width: '100%',
    height: '100%',
  },
})

export default styles
