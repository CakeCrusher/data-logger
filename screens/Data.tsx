import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native'

import Layout from '../components/Layout'
import InactedTranscription from '../components/InactedTranscription'
import { ClassifiedTranscription } from '../types'
import { clearTranscripts, fetchGraphQL, getTranscripts, removeTranscript } from '../helperFunctions'
import RNPickerSelect from 'react-native-picker-select';
import { GET_RUNNING, GET_TEST } from '../schemas'
import DataItem from '../components/DataItem'
import { getUser } from '../redux/actions/user'
import { connect } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import Login from '../components/Login'
import Chart from '../components/Chart'


const Data = (props) => {
  const [dataItems, setDataItems] = useState<any[]>([])
  const [trancripts, setTranscripts] = useState<ClassifiedTranscription[]>([])
  const [selectorValue, setSelectorValue] = useState<string>()
  const navigation = useNavigation()

  useEffect(() => {
    if (!props.user.userInfo.id && !props.user.userInfo.token) {
      props.getUser()
    }
    const initialyzingData = async () => {
      // await clearTranscripts()
      const pendingTranscripts = await getTranscripts()
      
      setTranscripts(pendingTranscripts)
    }
    if (dataItems) {
      setDataItems([])
    }
    initialyzingData()
    console.log('INIT Data');
    
  }, [])
  useEffect(() => {
    if (!props.user.token) {
      setDataItems([])
    }
  }, [props.user.token])

  const inactedTranscriptionList = trancripts.map(transcription => {
    const onRemoveTranscript = async () => {
      const newTranscripts = trancripts.filter(t => t.dateTime !== transcription.dateTime)
      await removeTranscript(transcription)
      setTranscripts(newTranscripts)
    }

    return (
      <View key={transcription.dateTime} style={{marginTop: 15}}>
        <InactedTranscription onRemoveTranscript={onRemoveTranscript} transcript={transcription} disabledSubmit={false} />
      </View>
    )
  })
  
  const InactedTranscriptionList = () => (<>{inactedTranscriptionList}</>)
  
  const getDataItems = async (schema: string, table: string) => {
    const allItems = await fetchGraphQL(schema, {}, props.user.token) 
    const parsedItems = allItems.data[table].map(item => {
      const newItem = {
        ...item,
        dateTime: new Date(item.dateTime).toISOString().split('.')[0]
      }
      return newItem
    })
    setDataItems(parsedItems)
  }

  const onSelectChange = async (table: string) => {
    setSelectorValue(table)
    let schema
    switch (table) {
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
      await getDataItems(schema, table)
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

  const LoginOrSelector = () => {
    if (props.user.token) {
      return (
        <View style={styles.selectorWrapper}>
          <RNPickerSelect
            placeholder={{label: 'Table', value: 'Table'}}
            style={{ inputAndroid: { color: 'white', padding: 20 } }}
            onValueChange={onSelectChange}
            items={[
              {label: 'test', value: 'test'},
              {label: 'running', value: 'running'},
            ]}
            value={selectorValue}
          />
        </View>
      )
    } else {
      return (
        <Login title="Login to show data" />
      )
    }
  }

  return (
    <Layout>
      <ScrollView>
        <View style={styles.container}>
          <InactedTranscriptionList/>
        </View>
        <View style={styles.selectorContainer}>
          <Text style={styles.selectorLabel}>Table data: </Text>
          <LoginOrSelector />
        </View>
        <Chart dataItems={dataItems} />
        <View style={styles.container}>
          <DataItems key={JSON.stringify(dataItems)}/>
        </View>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Record' as any)}>
            <Text style={styles.navButton}>Record</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('CreateTable' as any)}>
            <Text style={styles.navButton}>Create table</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  selectorContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    alignContent: 'center',
  },
  selectorLabel: {
    color: 'white',
    fontSize: 20,
    marginRight: 10,
  },
  selectorWrapper: {
    width: '50%',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 5,
    color: 'white',
    paddingHorizontal: 10,
  },
  navBar: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 40,
    justifyContent: 'flex-end',
  },
  navButton: {
    fontSize: 16,
    color: 'white',
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: '#007aff',
    alignSelf: 'flex-end',
    borderRadius: 5,
    margin: 5,
  }
})

const mapStateToProps = (state: any) => ({
  user: state.user,
})
const mapDispatchToProps = (dispatch: any) => ({
  getUser: () => dispatch(getUser()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Data)