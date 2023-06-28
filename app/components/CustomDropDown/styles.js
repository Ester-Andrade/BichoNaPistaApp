import { Dimensions, StyleSheet } from 'react-native'
import colors from '../../config/styles'
import scale from '../../config/HeightScale'

const styles = StyleSheet.create({
  root: {
    width: '72%',
  },
  field: {
    width: '100%',
    height: Dimensions.get('screen').height * 0.06,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 2,
    paddingHorizontal: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.gray,
  },
  text: {
    color: colors.gray,
    fontSize: 14 * scale,
  },
  image: {
    width: 14 * scale,
    height: 9 * scale,
    marginBottom: 4,
  },
  dropDown: {
    elevation: 3,
    marginTop: 2,
    height: 148 * scale,
    alignSelf: 'center',
    width: '100%',
    backgroundColor: colors.white,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  dropDownItem: {
    width: '90%',
    alignSelf: 'center',
    height: 50 * scale,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
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
