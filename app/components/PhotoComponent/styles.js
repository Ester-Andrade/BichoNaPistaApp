import { Dimensions, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  root: {
    width: Dimensions.get('screen').width * 0.25,
    height: Dimensions.get('screen').width * 0.25,
    backgroundColor: '#F2F2F2',
    borderWidth: 1,
    borderColor: '#666666',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeBtn: {
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingTop: 2,
    paddingRight: 4,
    width: '18%',
    height: '18%',
  },
  tochableArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhoto: {
    width: Dimensions.get('screen').width * 0.125,
    height: Dimensions.get('screen').width * 0.139,
  },
})

export default styles
