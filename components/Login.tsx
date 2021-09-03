import React, {useEffect, useState} from 'react'
import * as AuthSession from 'expo-auth-session'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import { jsonToUrlParams } from '../helperFunctions'
const fetch = require('node-fetch')
import { useNavigation } from '@react-navigation/native';

import { connect } from 'react-redux'
import { setToken } from '../redux/actions/user'
import { fetchGraphQL } from '../helperFunctions'
import { GET_USERINFO } from '../schemas'
import { AUTH_DOMAIN, AUTH_CLIENT_ID } from 'react-native-dotenv'

const auth0Domain = AUTH_DOMAIN
const auth0ClientId = AUTH_CLIENT_ID
// const redirectUrl = 'https://www.google.com'

const Login = (props) => {
  const [idToken, setIdToken] = useState('')
  const navigation = useNavigation() as any

  useEffect(() => {
    console.log('idToken after: ', idToken);
    // const fetchToken = async () => {
    //   const res = await fetch('https://dev-laprniv9.us.auth0.com/oauth/token', {
    //     method: 'POST',
    //     headers: { 'content-type': 'application/json' },
    //     body: JSON.stringify({client_id:"gHn8Eg7pYqc4CrRkhQBFJEjiRDCuWEL3", client_secret:"HahBHhq8UhPVzY7NXB9RVorNSJA0Dp_ZQe8x4_81Vw7ystyubWbYJvXpGjWdaGNO",audience:"https://hasura.io/learn",grant_type:"client_credentials"})
    //   }).then((res: any) => res.json())
      
    //   props.setToken(res.access_token)
    //   return res.access_token
    // }
    const fetchUserInfo = async () => {
      console.log('querying DB with token: ', idToken);
      const res = await fetchGraphQL(GET_USERINFO, {}, {'Authorization': `Bearer ${idToken}`})
      console.log('fetch UI res: ', res.data.auth0);
    }

    if (idToken) {
      console.log('Getting user info');
      
      fetchUserInfo()
    }
  }, [idToken])

  const loginWithAuth0 = async() => {
    const redirectUrl = AuthSession.getRedirectUrl()
    
    const authPerameters = jsonToUrlParams({
      client_id: auth0ClientId,
      response_type: 'id_token token',
      scope: 'email',
      redirect_uri: redirectUrl,
      nonce: '12345',
    })
    let authUrl = `https://${auth0Domain}/authorize?${authPerameters}` 
    const result = await AuthSession.startAsync({authUrl: authUrl})

    if (result.type === 'success') {
      console.log('idToken before: ', idToken);      
      setIdToken(result.params.id_token)
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
  }


  return (
    <View>
    <TouchableOpacity onPress={loginWithAuth0}>
      <Text style={styles.pageNav}>Log in</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={logoutWithAuth0}>
      <Text style={styles.pageNav}>Log out</Text>
    </TouchableOpacity>
    </View>
  )
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

const mapStateToProps = (state: any) => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  setToken: (token: string) => dispatch(setToken(token)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)