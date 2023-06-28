import { Dimensions, StyleSheet } from 'react-native'
import colors from '../../config/styles'
import scale from '../../config/HeightScale'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.white,
  },
  photoView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: Dimensions.get('screen').width * 0.0725,
  },
  rowView:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginTop: Dimensions.get('screen').width * 0.04,
  },
  geolocationBtn:{
    backgroundColor: colors.white,
    alignSelf: 'flex-end',
    height: Dimensions.get('screen').height * 0.04,
    width: Dimensions.get('screen').height * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 4,
    shadowColor: 'black',
  },
  geolocationIcon:{
    height: Dimensions.get('screen').height * 0.03,
    width: Dimensions.get('screen').height * 0.03,
    opacity: 0.65
  },
  rowView2:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginTop: Dimensions.get('screen').width * 0.04 - 15,
  },
  field: {
    width: '85%',
    marginTop: Dimensions.get('screen').width * 0.04,
  },
  field2: {
    width: '85%',
    marginTop: Dimensions.get('screen').width * 0.04 - 15,
  },
  advancedOps: {
    alignSelf: 'flex-start',
    marginLeft: '7.5%',
    marginTop: '12%',
  },
  obsArea: {
    width: '85%',
    marginTop: Dimensions.get('screen').width * 0.06,
  },
  checkBoxSet:{
    width: '85%',
    marginTop: '13%',
  },
  divider:{
    marginTop: '12%'
  },
  divider2:{
    marginTop: '5%'
  },
  sendBtn: {
    marginTop: '13%',
    marginBottom: '22%',
  },
  sendBtn2: {
    marginTop:'57%',
    marginBottom: '22%',
  },
  errors: {
    alignSelf: 'baseline',
    paddingLeft: 8,
    marginHorizontal: '7.5%',
    marginTop: 2,
    marginBottom: -17 * scale,
    color: colors.red,
    fontSize: 10 * scale,
  },
  finalError: {
    backgroundColor: colors.white,
    alignSelf: 'center',
    marginTop: '6%',
    marginBottom: -18 * scale,
    color: colors.red,
    fontSize: 12 * scale,
  },
})

export default styles
