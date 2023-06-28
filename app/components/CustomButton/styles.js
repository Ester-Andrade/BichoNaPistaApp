import { StyleSheet, Dimensions } from 'react-native'

const styles = StyleSheet.create({
  root: {
    width: '72%',
    height: Dimensions.get('screen').height * 0.055,
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
