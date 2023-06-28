import { StyleSheet } from 'react-native'
import colors from '../../config/styles'
import scale from '../../config/HeightScale'

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    width: '72%',
  },
  label: {
    position: 'absolute',
    alignSelf: 'baseline',
    marginLeft: 30,
    fontSize: 15 * scale,
    color: colors.gray,
    backgroundColor: colors.white,
  },
  field: {
    textAlignVertical: 'top',
    padding: 8,
    paddingTop: 15,
    marginTop: (15 * scale) / 1.5,
    width: '100%',
    borderWidth: 1.5,
    borderColor: colors.gray,
    color: colors.gray,
    fontWeight: 'normal',
    fontSize: 14 * scale,
    borderRadius: 10,
  },
  optional: {
    alignSelf: 'baseline',
    marginLeft: 8,
    marginTop: 2,
    color: colors.gray2,
    fontSize: 11 * scale,
  },
})

export default styles
