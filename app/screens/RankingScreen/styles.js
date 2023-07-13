import { StyleSheet, Dimensions } from 'react-native'
import colors from '../../config/styles'
import scale from '../../config/HeightScale'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.white,
  },
  scrollRoot: {
    flex: 1,
    width: '100%',
  },
  gradient: {
    alignItems: 'center',
    width: '100%',
    height: Dimensions.get('screen').width * 0.6694,
    borderBottomLeftRadius: 27,
    borderBottomRightRadius: 27,
  },
  title: {
    color: colors.darkGray2,
    fontSize: 18 * scale,
  },
  top3Line: {
    height: Dimensions.get('screen').width * 0.53,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  pos1: {
    alignItems: 'center',
    width: Dimensions.get('screen').width * 0.2822,
    marginBottom: Dimensions.get('screen').width * 0.06,
  },
  pos1Circle: {
    backgroundColor: colors.gray4,
    width: Dimensions.get('screen').width * 0.2222,
    height: Dimensions.get('screen').width * 0.2222,
    borderRadius: 10000,
  },
  pos2: {
    alignItems: 'center',
    width: Dimensions.get('screen').width * 0.31,
    marginBottom: Dimensions.get('screen').width * 0.12,
  },
  pos2Circle: {
    backgroundColor: colors.gray4,
    width: Dimensions.get('screen').width * 0.25,
    height: Dimensions.get('screen').width * 0.25,
    borderRadius: 10000,
  },
  pos3: {
    alignItems: 'center',
    width: Dimensions.get('screen').width * 0.2544,
  },
  pos3Circle: {
    backgroundColor: colors.gray4,
    width: Dimensions.get('screen').width * 0.1944,
    height: Dimensions.get('screen').width * 0.1944,
    borderRadius: 10000,
  },
  text: {
    color: colors.darkGray2,
    fontSize: 12,
    textAlign: 'center',
  },
  lineTitle: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: Dimensions.get('screen').width * 0.09,
    marginRight: Dimensions.get('screen').width * 0.028,
    marginBottom: -Dimensions.get('screen').width * 0.02,
  },
  pointsTitle: {
    width: Dimensions.get('screen').width * 0.14,
    alignItems: 'flex-end',
    marginLeft: Dimensions.get('screen').width * 0.03,
  },
  line: {
    flexDirection: 'row',
    marginTop: Dimensions.get('screen').width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finalLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Dimensions.get('screen').width * 0.08,
  },
  circle: {
    backgroundColor: colors.gray4,
    width: Dimensions.get('screen').width * 0.125,
    height: Dimensions.get('screen').width * 0.125,
    borderRadius: 10000,
  },
  number: {
    width: Dimensions.get('screen').width * 0.045,
    alignItems: 'flex-end',
    marginRight: Dimensions.get('screen').width * 0.03,
  },
  userName: {
    width: Dimensions.get('screen').width * 0.35,
    alignItems: 'flex-start',
    marginLeft: Dimensions.get('screen').width * 0.035,
  },
  points: {
    width: Dimensions.get('screen').width * 0.17,
    alignItems: 'flex-end',
  },
  watermark: {
    position: 'absolute',
    height: Dimensions.get('screen').width * 1.3638,
    opacity: 0.08,
    resizeMode: 'contain',
    marginTop: 16 * scale,
  },
  divider: {
    marginVertical: Dimensions.get('screen').width * 0.02,
  },
})

export default styles
