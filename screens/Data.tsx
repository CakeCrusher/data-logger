import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, View } from 'react-native'

import Layout from '../components/Layout'
import InactedTranscription from '../components/InactedTranscription'
import { Transcript } from '../types'
import { clearTranscripts, fetchGraphQL, getTranscripts, removeTranscript } from '../helperFunctions'
import RNPickerSelect from 'react-native-picker-select';
import { GET_RUNNING, GET_TEST } from '../schemas'
import DataItem from '../components/DataItem'


const Data = (props) => {
  const [dataItems, setDataItems] = useState<any[]>([])
  const [trancripts, setTranscripts] = useState<Transcript[]>([])
  const [selectorValue, setSelectorValue] = useState<string>()

  useEffect(() => {
    // log the current route with navigation
    
    
    const initialyzingData = async () => {
      // await clearTranscripts()
      const pendingTranscripts = await getTranscripts()
      setTranscripts(pendingTranscripts)
    }
    initialyzingData()
  }, [])

  const inactedTranscriptionList = trancripts.map(transcription => {
    const onRemoveTranscript = async () => {
      const newTranscripts = trancripts.filter(t => t.dateTime !== transcription.dateTime)
      await removeTranscript(transcription)
      setTranscripts(newTranscripts)
    }

    return <InactedTranscription key={transcription.dateTime} onRemoveTranscript={onRemoveTranscript} transcript={transcription} />
  })
  
  const InactedTranscriptionList = () => (<>{inactedTranscriptionList}</>)
  
  const onSelectChange = async (value: string) => {
    setSelectorValue(value)
    let schema
    switch (value) {
      case 'test':
        schema = GET_TEST
        break;
      case 'running':
        schema = GET_RUNNING
        break;
      default:
        schema = null
        setDataItems([])
        break;
    }
    if (schema) {
      const allItems = await fetchGraphQL(schema) 
      const parsedItems = allItems.data[value].map(item => {
        const newItem = {
          ...item,
          dateTime: new Date(item.dateTime).toISOString().split('T').join(' ').split('.')[0]
        }
        return newItem
      })
      setDataItems(parsedItems)
    }
  }

  const DataItems = () => {
    if (dataItems) {
      const dataItemsList = dataItems.map(item => <DataItem key={item.id} data={item}/>)
      return (<>{dataItemsList}</>)
    } else {
      return (<></>)
    }
  }

  return (
    <Layout>
      <View style={styles.container}>
        <InactedTranscriptionList/>
      </View>
      <RNPickerSelect
        style={{ inputAndroid: { color: 'white' } }}
        onValueChange={onSelectChange}
        items={[
          {label: 'test', value: 'test'},
          {label: 'running', value: 'running'},
        ]}
        value={selectorValue}
      />
      <View style={styles.container}>
        <DataItems key={JSON.stringify(dataItems)}/>
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  text: {
    color: 'white'
  },
  container: {
    width: '100%',
  },
  selector: {
    backgroundColor: 'white'
  }
})



export default Data