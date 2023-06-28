import { Dimensions, StyleSheet } from 'react-native'
import colors from '../../config/styles'

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.ligthGray,
    width: Dimensions.get('screen').height * 0.05,
    height: Dimensions.get('screen').height * 0.05,
    borderRadius: 1000,
    marginVertical: '2%',
    marginHorizontal: '6.5%',
    elevation: 2,
  },
  image: {
    width: '79%',
    height: '79%',
  },
})

export default styles
