import { StyleSheet } from 'react-native'
import colors from '../../config/styles'

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 22,
    backgroundColor: colors.red,
    marginBottom: -22
  },
  noConnectionText: {
    color: colors.white,
    fontSize: 11,
  }
})

export default styles