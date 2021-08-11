import React from 'react'
import { Text, StyleSheet, View } from 'react-native'

import Layout from '../components/Layout'

const Data = () => {
  return (
    <Layout>
        <View >
          <Text style={styles.text}>Data</Text>
        </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  text: {
    color: 'white'
  }
})


export default Data