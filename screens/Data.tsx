import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, View } from 'react-native'

import Layout from '../components/Layout'
import InactedTranscription from '../components/InactedTranscription'
import { Transcript } from '../types'
import { fetchGraphQL, getTranscripts, removeTranscript } from '../helperFunctions'
import RNPickerSelect from 'react-native-picker-select';
import { GET_TEST } from '../schemas'
import DataItem from '../components/DataItem'

const Data = () => {
  const [dataItems, setDataItems] = useState<any[]>([])
  const [trancripts, setTranscripts] = useState<Transcript[]>([])
  const [selectorValue, setSelectorValue] = useState<string>()

  useEffect(() => {
    const initialyzingData = async () => {
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
    switch (value) {
      case 'test':
        const allTestItems = await fetchGraphQL(GET_TEST) 
        const parsedTestItems = allTestItems.data.test.map(testItem => {
          const newTestItem = {
            ...testItem,
            dateTime: new Date(testItem.dateTime).toISOString().split('T').join(' ').split('.')[0]
          }
          return newTestItem
        })
        setDataItems(parsedTestItems)
        break;
      default:
        setDataItems([])
        break;
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