import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class MonitoringScreen extends React.Component {
    render(){return (
    <View style={styles.about}>
    <Text>Monitoring Screen</Text>
    </View>
    );}
}
   
const styles = StyleSheet.create({
    about: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    },
});