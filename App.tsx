import React, {useEffect} from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Recording from './screens/Record';
import Data from './screens/Data';
import CreateTable from './screens/CreateTable';
import { connect, Provider } from 'react-redux'
import { store } from './redux/store'
import Login from './components/Login'
import { getUser } from './redux/actions/user';

const Stack = createNativeStackNavigator()

const App = (props) => {
  return (
    <Provider store={store}>
      <NavigationContainer theme={{...DefaultTheme, colors: {...DefaultTheme.colors, background: '#222'}}}>
        <Stack.Navigator>
          <Stack.Screen
            name="CreateTable"
            component={CreateTable}
            options={({navigation}) => ({
              title: "CreateTable",
              headerStyle: {backgroundColor: '#222'},
              headerTitleStyle: {color: '#fff'},
              headerRight: () => (
                <Login />
              )
            })}
          />
          <Stack.Screen
            name="Record"
            component={Recording}
            options={({navigation}) => ({
              title: "Record",
              headerStyle: {backgroundColor: '#222'},
              headerTitleStyle: {color: '#fff'},
              headerRight: () => (
                <Login />
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
                <Login />
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

export default App