import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import Recording from './screens/Record';
import Data from './screens/Data';

const Stack = createStackNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Record"
          component={Recording}
          options={({navigation}) => ({
            title: "Record",
            headerStyle: {backgroundColor: '#222'},
            headerTitleStyle: {color: '#fff'},
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Data')}>
                <Text style={styles.pageNav}>Data</Text>
              </TouchableOpacity>
            )
          })}
        />
        <Stack.Screen
          name="Data"
          component={Data}
          options={({navigation}) => ({
            title: "Data",
            headerStyle: {backgroundColor: '#222'},
            headerTitleStyle: {color: '#fff'},
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Record')}>
                <Text style={{...styles.pageNav, backgroundColor: '#fec107', color: '#222'}}>Record</Text>
              </TouchableOpacity>
            )
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  pageNav: {
    fontSize: 16,
    color: 'white',
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: '#007aff',
    borderRadius: 5,
    margin: 5,
  }
})

export default App;

// send a request to https://speech.googleapis.com/v1/speech:recognize?key=YOUR_API_KEY
// and get back a JSON response
// {
//   "results": [
//     {
//       "alternatives": [
//         {
//           "transcript": "hello"
//         }
//       ]
//     }
//   ]
// }

// web: 993323339867-h0olf9dihkjuiktadurnfvbgvum0q4s6.apps.googleusercontent.com
// android: 