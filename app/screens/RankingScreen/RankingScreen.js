import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const RankingScreen = () => {
    return (
    <View style={styles.about}>
    <Text>Ranking Screen</Text>
    </View>
    );
}

const styles = StyleSheet.create({
    about: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    },
});

export default RankingScreen;

// Declarado com função = componente stateless 