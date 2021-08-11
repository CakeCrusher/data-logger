import React, { ReactFragment, useState, useEffect, useRef } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native'
import { Audio } from 'expo-av'
import {AudioFilled} from '@ant-design/icons'

import Layout from '../components/Layout'

const Recording = () => {
  const [recording, setRecording] = useState<any>()
  const [isRecording, setIsRecording] = useState(false)

  const [sound, setSound] = useState<any>()

  const Player = useRef(new Audio.Sound())

  useEffect(() => {
    return sound ? () => {
      console.log('unloading sound');
      sound.unloadAsync()
    } : undefined
  }, [sound])

  const playSoundbyte = async () => {
    console.log('loading sound');
    const _sound = await Audio.Sound.createAsync(
      require('../assets/zoom.wav')
    )
    setSound(_sound.sound)
    console.log('playing sound');
    await _sound.sound.playAsync()
  }

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

    console.log(`recording stopped, uri: ${uri}`);
    setRecording(undefined)
  }

  const RecordButton = () => {
    if (isRecording) {
      return (
        <TouchableOpacity onPress={stoppedRecording}>
          <Text style={{...styles.recordButton, backgroundColor: '#dc3546'}}>Stop recording</Text>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity onPress={startRecording}>
          <Text style={{...styles.recordButton, backgroundColor: '#7a7a7a'}}>Start recording</Text>
        </TouchableOpacity>
      )
    }
  }
  

  const PlaySoundbyte = () => {
    return (
      <TouchableOpacity onPress={playSoundbyte}>
        <Text style={{...styles.recordButton, backgroundColor: '#007aff'}}>Play Sound</Text>
      </TouchableOpacity>
    )
  }


  return (
    <Layout>
        <View>
          <RecordButton />
          <PlaySoundbyte  />
        </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  text: {
    color: 'white'
  },
  recordButton: {
    fontSize: 20,
    // width: 50,
    // height: 50,
    padding: 20,
    borderRadius: 5,
    color: 'white'
  }
})


export default Recording