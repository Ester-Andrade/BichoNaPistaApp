import { StyleSheet } from 'react-native'
import colors from '../../config/styles'
import scale from '../../config/HeightScale'

const styles = StyleSheet.create({
  image_expander: {
    marginRight: 4,
    marginTop: 6 * scale,
    width: 14 * scale,
    height: 8 * scale,
  },
  image_normal: {
    width: 0,
    height: 0,
  },
  image_shrinker: {
    marginRight: 4,
    marginTop: 6 * scale,
    width: 14 * scale,
    height: 8 * scale,
    transform: [{ rotate: '180deg' }],
  },
  text_expander: {
    color: colors.gray,
  },
  text_normal: {
    textDecorationLine: 'underline',
    color: colors.gray,
  },
  text_shrinker: {
    color: colors.gray,
  },
  image_editar: {
    alignSelf: 'center',
    marginRight: 2,
    marginTop: 1 * scale,
    width: 14 * scale,
    height: 11 * scale,
  },
  text_editar: {
    textDecorationLine: 'underline',
    color: colors.gray3,
  },
  image_editar2: {
    alignSelf: 'center',
    marginRight: 4,
    marginTop: 4 * scale,
    width: 14 * scale,
    height: 13 * scale,
  },
  text_editar2: {
    textDecorationLine: 'underline',
    color: colors.gray3,
  },
})

export default styles
