import React, { useState, useEffect } from 'react'
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Audio } from 'expo-av'
import { Foundation } from '@expo/vector-icons'



const PlaySoundbyte = () => {
  const [sound, setSound] = useState<any>()

  useEffect(() => {
    return sound ? () => {
      console.log('unloading sound');
      sound.unloadAsync()
    } : undefined
  }, [sound])

  const playSoundbyte = async () => {
    console.log('loading sound');
    const _sound = await Audio.Sound.createAsync(
      require('../assets/hello.mp3')
    )
    setSound(_sound.sound)
    console.log('playing sound');
    await _sound.sound.playAsync()
  }

  return (
    <TouchableOpacity style={styles.playButton} onPress={playSoundbyte}>
      <Foundation name="sound" size={40} color="white" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  text: {
    color: 'white'
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#007aff',
    borderRadius: 5,
    color: 'white',
    marginTop: 20,
  }
})

export default PlaySoundbyte