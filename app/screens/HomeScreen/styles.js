import { StyleSheet, Dimensions } from 'react-native'
import colors from '../../config/styles'
import scale from '../../config/HeightScale'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  map: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  addBtn: {
    position: 'absolute',
    alignSelf: 'flex-end',
    width: Dimensions.get('screen').width * 0.15,
    height: Dimensions.get('screen').width * 0.15,
    bottom: Dimensions.get('screen').width * 0.44,
    right: Dimensions.get('screen').width * 0.055,
    borderRadius: 1000,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {
      width: 2,
      height: -2,
    },
  },
  gradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1000,
  },
  BtnImage: {
    width: '72%',
    height: '85%',
    marginLeft: '7%',
  },
  bottomContainer: {
    width: '100%',
    bottom: -Dimensions.get('screen').width * 0.4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  latestRecords: {
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    width: '100%',
    height: Dimensions.get('window').width * 0.49,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    width: '6%',
    backgroundColor: colors.gray,
    borderColor: colors.gray,
    borderWidth: 2,
    borderRadius: 10,
    marginTop: '2%',
  },
  latestRecordsText: {
    alignSelf: 'flex-start',
    fontSize: 10 * scale,
    color: colors.darkGray2,
    marginLeft: '10%',
    marginBottom: '2.6%',
  },
  latestRecordsItem: {
    backgroundColor: colors.ligthGray,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 7.5,
    paddingHorizontal: Dimensions.get('screen').width * 0.032,
    width: Dimensions.get('screen').width * 0.80,
    height: '88%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    elevation: 2,
  },
  photo: {
    width: Dimensions.get('screen').width * 0.27,
    height: Dimensions.get('screen').width * 0.27,
    borderWidth: 2,
    borderRadius: 6,
    borderColor: 	colors.gray3,
    opacity: 0.45,
    // elevation: 2,
  },
  info: {
    flex: 1,
    marginLeft: Dimensions.get('screen').width * 0.02,
  },
  title: {
    fontSize: 15 * scale,
    color: colors.gray3,
  },
  text: {
    fontSize: 13 * scale,
    color: colors.gray3,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export default styles
