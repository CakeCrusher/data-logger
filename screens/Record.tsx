import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import * as FileSystem from 'expo-file-system'
import AsyncStorage from '@react-native-async-storage/async-storage';


import Layout from '../components/Layout'
import RecordButton from '../components/RecordButton'
import { Transcript } from '../types'
import InactedTranscription from '../components/InactedTranscription'
import { addTranscript, removeTranscript } from '../helperFunctions';

const Recording = () => {
  const [transcription, setTranscription] = useState<Transcript | undefined>()
  const [uri, setURI] = useState<string | undefined>()

  useEffect(() => {
    const postRecorded = async () => {
      if (uri) {
        const audioBase64 = await FileSystem.readAsStringAsync(uri, {encoding: FileSystem.EncodingType.Base64})
        const httpBody = {
          audioBase64
        }
        const backendURL = 'https://3c3a-68-234-232-28.ngrok.io/transcribe'
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

    postRecorded()

  }, [uri])

  const onRemoveTranscript = async () => {
    await removeTranscript(transcription)
    setTranscription(undefined)
  }


  return (
    <Layout>
        <View style={styles.container}>
          <RecordButton setURI={setURI} />
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


export default Recording