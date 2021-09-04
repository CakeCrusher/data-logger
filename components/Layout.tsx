import React, { ReactFragment } from 'react'
import { View, StyleSheet, StatusBar, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const Layout = ({children}: {children: ReactFragment}): JSX.Element => {
    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#222' />
            {children}
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: '#222',
        padding: 20,
        width: '100%',
        // height: '100%',
        alignItems: 'center',
    },

})

export default Layout