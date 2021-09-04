import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Button, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useSelector, useDispatch, connect } from 'react-redux'
import * as FileSystem from 'expo-file-system'
import Login from '../components/Login'


import Layout from '../components/Layout'
import RecordButton from '../components/RecordButton'
import { Transcript } from '../types'
import InactedTranscription from '../components/InactedTranscription'
import { addTranscript, removeTranscript } from '../helperFunctions';
import {BACKEND_URL} from 'react-native-dotenv'
import { getUser } from '../redux/actions/user'
import { useNavigation } from '@react-navigation/native'



const Recording = (props: any) => {
  const [transcription, setTranscription] = useState<Transcript | undefined>()

  const counter = useSelector((state: any) => state.counter)
  const dispatch = useDispatch()
  const navigation = useNavigation()

  useEffect(() => {
    if (!props.user.userInfo.id && !props.user.userInfo.token) {
      props.getUser()
    }
  }, [])
  useEffect(() => {
    const postRecorded = async () => {
      if (props.recordingURI) {
        console.log('posting');
        const audioBase64 = await FileSystem.readAsStringAsync(props.recordingURI, {encoding: FileSystem.EncodingType.Base64})
        const httpBody = {
          audioBase64
        }
        const transcribeUrl = 'http://6c38-68-234-232-22.ngrok.io/transcribe'
        
        const res = await fetch(transcribeUrl, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(httpBody)
        })
        const jsonRes: Transcript = await res.json()
        console.log('jsonRes: ', jsonRes);
        
        if (jsonRes) {
          if(jsonRes.table !== 'ERROR') {
            addTranscript(jsonRes)
          }
          setTranscription(jsonRes)
        }
      }
    }

    postRecorded()

  }, [props.recordingURI])

  const onRemoveTranscript = async () => {
    if (transcription && transcription.table !== 'ERROR') {
      await removeTranscript(transcription)
    }
    setTranscription(undefined)
  }


  return (
    <Layout>
        <ScrollView style={styles.container}>
          <RecordButton />
          <View style={{marginTop: 20}}>
            <InactedTranscription key={JSON.stringify(transcription)} onRemoveTranscript={onRemoveTranscript} transcript={transcription} />
          </View>
          <View style={styles.navBar}>
            <TouchableOpacity onPress={() => navigation.navigate('Data' as any)}>
              <Text style={styles.navButton}>Data</Text>
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
  recordingURI: state.recordingURI.recordingURI,
  user: state.user,
})
const mapDispatchToProps = (dispatch: any) => ({
  getUser: () => dispatch(getUser()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Recording)