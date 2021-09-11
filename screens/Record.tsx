import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Button, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useSelector, useDispatch, connect } from 'react-redux'
import * as FileSystem from 'expo-file-system'
import Login from '../components/Login'


import Layout from '../components/Layout'
import RecordButton from '../components/RecordButton'
import { ClassifiedTranscription } from '../types'
import InactedTranscription from '../components/InactedTranscription'
import { addTranscript, fetchGraphQL, removeTranscript } from '../helperFunctions';
import {BACKEND_URL} from 'react-native-dotenv'
import { getUser } from '../redux/actions/user'
import { useNavigation } from '@react-navigation/native'
import { CLASSIFY_TRANSCRIPTION, TRANSCRIPTION } from '../schemas'



const Recording = (props: any) => {
  const [classifiedTranscription, setClassifiedTranscription] = useState<ClassifiedTranscription | undefined>()

  const navigation = useNavigation()

  useEffect(() => {
    if (!props.user.userInfo.id && !props.user.userInfo.token) {
      props.getUser()
    }
  }, [])
  useEffect(() => {
    const postRecorded = async () => {
      if (props.transcription.transcript) {
        const classifyTranscriptRes = await fetchGraphQL(CLASSIFY_TRANSCRIPTION, {transcript: props.transcription.transcript}, props.user.token)
        let classifyTranscript = classifyTranscriptRes.data.classifyTranscript
        classifyTranscript = {...classifyTranscript, payload: JSON.parse(classifyTranscript.payload)}
        console.log(classifyTranscript);
        const jsonRes = classifyTranscript
        
        if (jsonRes) {
          if(jsonRes.table !== 'ERROR') {
            addTranscript(jsonRes)
          }
          setClassifiedTranscription(jsonRes)
        }
      }
    }

    postRecorded()

  }, [props.transcription.transcript])

  const onRemoveTranscript = async () => {
    if (classifiedTranscription && classifiedTranscription.table !== 'ERROR') {
      await removeTranscript(classifiedTranscription)
    }
    setClassifiedTranscription(undefined)
  }


  return (
    <Layout>
        <ScrollView style={styles.container}>
          <View style={styles.buttonContainer}>
            <RecordButton />
          </View>
          <View style={{marginTop: 20}}>
            <InactedTranscription key={JSON.stringify(classifiedTranscription)} onRemoveTranscript={onRemoveTranscript} transcript={classifiedTranscription} disabledSubmit={false} />
          </View>
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => navigation.navigate('Data' as any)}>
              <Text style={styles.navButton}>Data</Text>
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
  buttonContainer: {
    height: 100,
  },
  text: {
    color: 'white'
  },
  container: {
    width: '100%',
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
  transcription: state.transcription
})
const mapDispatchToProps = (dispatch: any) => ({
  getUser: () => dispatch(getUser()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Recording)