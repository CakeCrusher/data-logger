import React, {useEffect, useState} from 'react'
import * as AuthSession from 'expo-auth-session'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import { jsonToUrlParams } from '../helperFunctions'
const fetch = require('node-fetch')
import { useNavigation } from '@react-navigation/native';

import { connect } from 'react-redux'
import { setToken, clearToken, setUserInfo, clearUserInfo } from '../redux/actions/user'
import { fetchGraphQL } from '../helperFunctions'
import { GET_USERINFO } from '../schemas'
import { AUTH_DOMAIN, AUTH_CLIENT_ID } from 'react-native-dotenv'
import Auth0 from 'react-native-auth0'
import { UserInfo } from '../types'

const auth0Domain = AUTH_DOMAIN
const auth0ClientId = AUTH_CLIENT_ID
// const redirectUrl = 'https://www.google.com'

const Login = (props) => {
  const navigation = useNavigation() as any

  useEffect(() => {
    console.log('props.user: ', props.user);
    
    const fetchUserInfo = async () => {
      const res = await fetchGraphQL(GET_USERINFO, {}, props.user.token)
      if (!res.data) {
        return null
      }
      props.setUserInfo({
        id: res.data.auth0.id,
        name: res.data.auth0.name,
        email: res.data.auth0.email
      })
    }

    if (props.user.token && !props.user.userInfo.id) {
      console.log('Getting user info');
      
      fetchUserInfo()
    }
  }, [props.user.token])

  const loginWithAuth0 = async() => {
    const redirectUrl = AuthSession.getRedirectUrl()
    console.log('redirectUrl: ', redirectUrl);
    
    const authPerameters = jsonToUrlParams({
      client_id: auth0ClientId,
      response_type: 'id_token token code',
      audience: 'https://hasura.io/learn',
      grant_type: 'refresh_token',
      scope: 'offline_access',
      redirect_uri: redirectUrl,
      nonce: '12345',
    })
    let authUrl = `https://${auth0Domain}/authorize?${authPerameters}` 
    const result = await AuthSession.startAsync({authUrl: authUrl})

    console.log('result: ', result);
    

    if (result.type === 'success') {
      props.setToken(result.params.id_token)
    }
  }


  const logoutWithAuth0 = async() => {
    const redirectUrl = AuthSession.getRedirectUrl()
    const logoutPerameters = jsonToUrlParams({
      client_id: auth0ClientId,
      returnTo: redirectUrl
    })
    let logoutUrl = `https://${auth0Domain}/v2/logout?${logoutPerameters}` 
    const result = await AuthSession.startAsync({authUrl: logoutUrl})
    props.clearToken()
    props.clearUserInfo()
  }

  if (props.user.token) {
    return (
      <View style={styles.logOutContainer}>
        <Text style={styles.text}>{props.user.userInfo.name}</Text>
        <TouchableOpacity onPress={logoutWithAuth0}>
          <Text style={{...styles.buttonText, backgroundColor: '#dc3546'}}>Log out</Text>
        </TouchableOpacity>
      </View>
    )
  } else {
    return (
      <View>
        <TouchableOpacity onPress={loginWithAuth0}>
          <Text style={styles.buttonText}>{props.title ? props.title : 'Log in'}</Text>
        </TouchableOpacity>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: 'white',
    paddingVertical: 6,
    margin: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    margin: 5,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#007aff',
  },
  logOutContainer: {
    flexDirection: 'row'
  }
})

const mapStateToProps = (state: any) => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => ({
  setToken: (token: string) => dispatch(setToken(token)),
  clearToken: () => dispatch(clearToken()),
  setUserInfo: (userInfo: UserInfo) => dispatch(setUserInfo(userInfo)),
  clearUserInfo: () => dispatch(clearUserInfo()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)