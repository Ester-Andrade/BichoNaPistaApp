import { StyleSheet } from 'react-native'
import colors from '../../config/styles'
import scale from '../../config/HeightScale'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'flex-start',
    width: '72%',
    height: '100%',
  },
  text: {
    color: colors.gray,
    fontSize: 14 * scale,
    marginLeft: 11,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 15 * scale,
    color: colors.gray,
    marginBottom: 10,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 35 * scale,
    marginLeft: 30 * scale,
  },
  checkBox: {
    width: 17 * scale,
    height: 17 * scale,
    borderWidth: 1.5,
  },
  optional: {
    alignSelf: 'baseline',
    marginLeft: 8,
    color: colors.gray2,
    fontSize: 11 * scale,
    marginTop: -10,
    marginBottom: 10,
  },
  errors: {
    backgroundColor: colors.white,
    alignSelf: 'baseline',
    paddingLeft: 8,
    color: colors.red,
    fontSize: 10 * scale,
    marginTop: -10,
    marginBottom: 8,
  },
})

export default styles
