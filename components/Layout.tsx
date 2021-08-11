import React, { ReactFragment } from 'react'
import { View, StyleSheet, StatusBar } from 'react-native'

const Layout = ({children}: {children: ReactFragment}): JSX.Element => {
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
        flex: 1,
        alignItems: 'center',
    }
})

export default Layout