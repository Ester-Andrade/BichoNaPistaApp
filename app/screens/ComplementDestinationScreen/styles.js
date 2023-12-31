import { StyleSheet, Dimensions } from 'react-native'
import colors from '../../config/styles'
import scale from '../../config/HeightScale'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.white,
  },
  Card: {
    backgroundColor: colors.ligthGray,
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: Dimensions.get('screen').width * 0.032,
    width: Dimensions.get('screen').width * 0.9111,
    // height: Dimensions.get('screen').width * 0.4805,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    elevation: 2,
  },
  CardHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  CardInfo: {
    flexDirection: 'row',
  },
  photo: {
    width: Dimensions.get('screen').width * 0.27,
    height: Dimensions.get('screen').width * 0.27,
    borderWidth: 2,
    borderRadius: 6,
    borderColor: colors.gray3,
    opacity: 0.85,
  },
  info: {
    flex: 1,
    alignSelf: 'center',
    marginLeft: Dimensions.get('screen').width * 0.06,
    marginRight: Dimensions.get('screen').width * 0.03
  },
  title: {
    alignSelf: 'flex-start',
    marginTop: 3 * scale,
    marginBottom: 3 * scale,
    fontSize: 15 * scale,
    color: colors.gray3,
  },
  clockIcon: {
    alignSelf: 'center',
    height: 13 * scale,
    width: 11 * scale
  },
  text: {
    fontSize: 14 * scale,
    color: colors.gray3,
  },
  text2: {
    fontSize: 12 * scale,
    color: colors.gray3,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editar: {
    alignSelf: 'flex-start',
    marginTop: Dimensions.get('screen').width * 0.01,
    marginBottom: Dimensions.get('screen').width * 0.025
  },
  watermark2: {
    alignSelf: 'center',
    marginTop: '60%',
    height: Dimensions.get('screen').width * 0.45,
    opacity: 0.11,
    resizeMode: 'contain',
  },
  noRegsText: {
    alignSelf: 'center',
    width: Dimensions.get('screen').width * 0.70,
    marginTop: Dimensions.get('screen').height * 0.37,
    fontSize: 15 * scale,
    color: colors.gray4,
    textAlign: 'center'
  },
  photoImage: {
    width:'100%',
    height:'100%',
    opacity: 1,
    //elevation: 2,
  },
})

export default styles
