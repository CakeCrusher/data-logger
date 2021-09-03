import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Button, Text } from 'react-native'
import { useSelector, useDispatch, connect } from 'react-redux'
import * as FileSystem from 'expo-file-system'
import Login from '../components/Login'


import Layout from '../components/Layout'
import RecordButton from '../components/RecordButton'
import { Transcript } from '../types'
import InactedTranscription from '../components/InactedTranscription'
import { addTranscript, removeTranscript } from '../helperFunctions';
import {BACKEND_URL} from 'react-native-dotenv'



const Recording = (props: any) => {
  const [transcription, setTranscription] = useState<Transcript | undefined>()

  const counter = useSelector((state: any) => state.counter)
  const dispatch = useDispatch()

  useEffect(() => {
    const postRecorded = async () => {
      if (props.recordingURI) {
        const audioBase64 = await FileSystem.readAsStringAsync(props.recordingURI, {encoding: FileSystem.EncodingType.Base64})
        const httpBody = {
          audioBase64
        }
        const backendURL = `${BACKEND_URL}/transcribe`
        const res = await fetch(backendURL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(httpBody)
        })
        const jsonRes: Transcript = await res.json()
        console.log(jsonRes);
        
        if (jsonRes && jsonRes.table !== 'ERROR') {
          console.log(jsonRes);
          addTranscript(jsonRes)
          setTranscription(jsonRes)
        } else {
          setTranscription(undefined)
        }
      }
    }

    postRecorded()

  }, [props.recordingURI])

  const onRemoveTranscript = async () => {
    await removeTranscript(transcription)
    setTranscription(undefined)
  }


  return (
    <Layout>
        <View style={styles.container}>
          <Login />
          <RecordButton />
          <InactedTranscription key={JSON.stringify(transcription)} onRemoveTranscript={onRemoveTranscript} transcript={transcription} />
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
  }
})

const mapStateToProps = (state: any) => ({
  recordingURI: state.recordingURI.recordingURI
})
const mapDispatchToProps = (dispatch: any) => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(Recording)