import React, {useState} from 'react'
import { Text, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native'
import { TestPayload, Transcript } from '../types'

import Layout from './Layout'
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { fetchGraphQL } from '../helperFunctions';
import { SAVE_TEST } from '../schemas';

type DataItemProps = {
  data: any
}

const DataItem = (props: DataItemProps) => {
  const LabelDataPair = ({_key}) => (
    <View style={styles.labelDataPairContainer}>
      <Text style={styles.label}>{_key}:</Text>
      <Text style={styles.data}>{props.data[_key]}</Text>
    </View>
  )
  const labelDataPairs = Object.keys(props.data).map((key) => {
    if ((key !== 'dateTime') && (key !== 'id')) {
      return <LabelDataPair key={key+props.data.id} _key={key} />
    }
  })
  const LabelDataPairs = () => <>{labelDataPairs}</>

  return (
    <Layout>
        <View style={styles.vLineContainer}>
          <View style={styles.vLine}/>
          <View style={styles.contentContainer}>
            <Text style={styles.date}>{props.data.dateTime.split('T').join(' ')}</Text>
            <LabelDataPairs />
          </View>
        </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  vLineContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  vLine: {
    width: 1,
    marginRight: 10,
    backgroundColor: '#007aff'
  },
  contentContainer: {
    width: '90%'
  },
  date: {
    opacity: 0.5,
    fontSize: 14,
    color: 'white',
  },
  labelDataPairContainer: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 16,
    opacity: 0.7,
    color: 'white',
    width: '30%',
  },
  data: {
    fontSize: 16,
    color: 'white',
    width: '60%',
  }
})


export default DataItem