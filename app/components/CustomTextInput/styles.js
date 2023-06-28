import { Dimensions, StyleSheet } from 'react-native'
import colors from '../../config/styles'
import scale from '../../config/HeightScale'

const styles = StyleSheet.create({
  root: {
    width: '72%',
    height: Dimensions.get('screen').height * 0.06,
  },
  field: {
    textAlignVertical: 'bottom',
    paddingLeft: 6,
    paddingBottom: 3,
    width: '100%',
    height: '100%',
    borderBottomWidth: 1.5,
    borderBottomColor: colors.gray,
    color: colors.gray,
    fontWeight: 'normal',
    fontSize: 14 * scale,
  },
  label:{
    position: 'absolute',
    marginTop: Dimensions.get('screen').height * 0.013,
    marginLeft: 5,
    fontSize: 11 * scale,
    color: colors.gray,
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
