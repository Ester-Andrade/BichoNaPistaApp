import { StyleSheet } from 'react-native'
import colors from '../../config/styles'
import scale from '../../config/HeightScale'

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    width: '96%',
  },
  label: {
    alignSelf: 'baseline',
    marginLeft: '11%',
    fontSize: 15 * scale,
    color: colors.darkGray,
    backgroundColor: colors.white,
  },
  line: {
    position: 'absolute',
    marginTop: (15 * scale) / 1.5,
    width: '100%',
    borderTopWidth: 1.5,
    borderColor: '#D9D9D9',
  },
})

export default styles
