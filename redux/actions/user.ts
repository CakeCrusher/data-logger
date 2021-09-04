import AsyncStorage from '@react-native-async-storage/async-storage'
import { User, UserInfo } from '../../types'

export const setUserState = (user: User) => ({
  type: 'SET_USER',
  user,
})

export const setTokenState = (token: string) => ({
  type: 'SET_TOKEN',
  token
})

export const setUserInfoState = (userInfo: UserInfo) => ({
  type: 'SET_USERINFO',
  userInfo
})

export const clearUserInfoState = () => ({
  type: 'CLEAR_USERINFO'
})

export const clearTokenState = () => ({
  type: 'CLEAR_TOKEN'
})

export const setToken = (token: string) => async (dispatch) => {
  await AsyncStorage.setItem('token', token)
  dispatch(setTokenState(token))
}

export const setUserInfo = (userInfo: UserInfo) => async (dispatch) => {
  await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
  dispatch(setUserInfoState(userInfo))
}

export const clearToken = () => async (dispatch) => {
  await AsyncStorage.removeItem('token')
  dispatch(clearTokenState())
}

export const clearUserInfo = () => async (dispatch) => {
  await AsyncStorage.removeItem('userInfo')
  dispatch(clearUserInfoState())
}

export const getUser = () => async (dispatch) => {
  let token = await AsyncStorage.getItem('token')
  token = token ? token : null
  const userInfoStr = await AsyncStorage.getItem('userInfo')
  const userInfo: UserInfo = userInfoStr ? JSON.parse(userInfoStr) : {id: null, name: null, email: null}
  dispatch(setUserState({token, userInfo: userInfo}))
} 