import React, { useState, useRef } from 'react'
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Audio } from 'expo-av'
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux'
import { setRecordingURI } from '../redux/actions/recordingURI'
import * as FileSystem from 'expo-file-system'
import { fetchGraphQL } from '../helperFunctions';
import { TRANSCRIPTION } from '../schemas';
import {setTranscription} from '../redux/actions/transcription'

// type RecordingProps = {
//   setURI: React.Dispatch<React.SetStateAction<string | undefined>>
// }

const RecordButton = (props) => {
  const [recording, setRecording] = useState<any>()
  const [isRecording, setIsRecording] = useState(false)

  // const Player = useRef(new Audio.Sound())

  const playSound = async (uri) => {
    // const preExistingSound = await Player.current.getStatusAsync()
    // if (preExistingSound.isLoaded) {
    //   console.log('unloading sound');
    //   Player.current.unloadAsync()
    // }
    // console.log('loading sound');
    
    // await Player.current.loadAsync(
    //   { uri },
    //   {},
    //   true
    // )
    // const response = await Player.current.getStatusAsync()
    // if (response.isLoaded) {
    //   Player.current.playAsync()
    // }
  }

  const startRecording = async () => {
    console.log('start clicked');
    await Audio.requestPermissionsAsync()
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true
    })
    console.log('starting recording..');
    const _recording = await Audio.Recording.createAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    )
    setRecording(_recording.recording)
    console.log('recording stated');
    setIsRecording(true)
  }
  
  const setTranscript = async (uri: string) => {
    console.log('setting transcript');
    const audioBase64 = await FileSystem.readAsStringAsync(uri, {encoding: FileSystem.EncodingType.Base64})
    const transcriptionRes = await fetchGraphQL(TRANSCRIPTION, {audioBase64}, props.user.token)
    console.log(transcriptionRes);
    
    const transcript = transcriptionRes.data.transcription.transcript
    
    props.setTranscription(transcript)
  }

  const stoppedRecording = async () => {
    console.log('Stopping recording');
    setIsRecording(false)
    await recording.stopAndUnloadAsync()
    let uri: string = recording.getURI()

    console.log('loading sound');
    await playSound(uri)

    await setTranscript(uri)

    setRecording(undefined)
  }

  if (isRecording) {
    return (
      <TouchableOpacity onPress={stoppedRecording}>
        <View style={{...styles.recordButton, backgroundColor: '#dc3546'}}>
          <FontAwesome name="microphone" size={60} color="white" />
        </View>
      </TouchableOpacity>
    )
  } else {
    return (
      <TouchableOpacity onPress={startRecording}>
        <View style={{...styles.recordButton, backgroundColor: '#6c747e'}}>
          <FontAwesome name="microphone" size={60} color="white" />
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    color: 'white'
  },
  recordButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
    height: '100%',
    borderRadius: 5,
    color: 'white'
  },
})

const mapStateToProps = (state: any) => ({
  transcription: state.transcription,
  user: state.user
})

const mapDispatchToProps = (dispatch: any) => ({
  setTranscription: (transcript: string) => dispatch(setTranscription(transcript))
})


export default connect(mapStateToProps, mapDispatchToProps)(RecordButton)