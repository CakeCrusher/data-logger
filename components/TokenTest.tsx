import React, {useEffect} from 'react'
import {
  View,
  Text,
} from 'react-native'
import { connect } from 'react-redux'
import { saveUserToken } from '../redux/actions/userAuth'

const TokenTest = (props: any) => {
  useEffect(() => {
    console.log('Getting token');
    
    props.saveUserToken('hello world')
  }, [])

  return (
    <View>
      <Text>token: {props.token.token}</Text>
    </View>
  )
}

const mapStateToProps = (state: any) => ({
  token: state.token
})

const mapDispatchToProps = dispatch => ({
  saveUserToken: (token: string) => dispatch(saveUserToken(token)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TokenTest)