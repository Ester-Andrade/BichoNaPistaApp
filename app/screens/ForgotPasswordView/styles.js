import { StyleSheet } from 'react-native'
import colors from '../../config/styles'
import scale from '../../config/HeightScale'

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    backgroundColor: colors.ligthGray,
    position: 'absolute',
    width: '84%',
    borderRadius: 25,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    padding: 15,
  },
  field: {
    height: '16%',
    marginTop: '1%',
  },
  errors: {
    backgroundColor: colors.ligthGray,
    alignSelf: 'baseline',
    paddingLeft: 8,
    marginLeft: '14%',
    marginRight: '14%',
    marginTop: 2,
    marginBottom: -17 * scale,
    color: colors.red,
    fontSize: 11 * scale,
  },
  recoverBtn: {
    marginTop: '20%',
  },
})

export default styles
