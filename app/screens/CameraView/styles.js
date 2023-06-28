import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  takePicture: {
    position: 'absolute',
    alignSelf: 'center',
    width: 70,
    height: 70,
    bottom: '5%',
    left: '40%',
    borderRadius: 35,
    borderColor: '#FFFFFF',
    borderWidth: 6,
  },
})

export default styles
