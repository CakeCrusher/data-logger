import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Recording from './screens/Record';
import Data from './screens/Data';
import { Provider } from 'react-redux'
import { store } from './redux/store'

const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer theme={{...DefaultTheme, colors: {...DefaultTheme.colors, background: '#222'}}}>
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
    </Provider>
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