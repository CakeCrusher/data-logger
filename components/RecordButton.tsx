import React, { useState, useRef } from 'react'
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Audio } from 'expo-av'
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux'
import { setRecordingURI } from '../redux/actions/recordingURI'

// type RecordingProps = {
//   setURI: React.Dispatch<React.SetStateAction<string | undefined>>
// }

const RecordButton = (props) => {
  const [recording, setRecording] = useState<any>()
  const [isRecording, setIsRecording] = useState(false)

  const Player = useRef(new Audio.Sound())

  const playSound = async (uri) => {
    const preExistingSound = await Player.current.getStatusAsync()
    if (preExistingSound.isLoaded) {
      console.log('unloading sound');
      Player.current.unloadAsync()
    }
    console.log('loading sound');
    
    await Player.current.loadAsync(
      { uri },
      {},
      true
    )
    const response = await Player.current.getStatusAsync()
    if (response.isLoaded) {
      Player.current.playAsync()
    }
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
  

  const stoppedRecording = async () => {
    console.log('Stopping recording');
    setIsRecording(false)
    await recording.stopAndUnloadAsync()
    let uri: string = recording.getURI()

    console.log('loading sound');
    await playSound(uri)

    props.setRecordingURI(uri)

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
    height: 400,
    borderRadius: 5,
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
  setRecordingURI: (uri: string) => dispatch(setRecordingURI(uri))
})


export default connect(mapStateToProps, mapDispatchToProps)(RecordButton)