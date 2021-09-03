import AsyncStorage from '@react-native-async-storage/async-storage'

export const setTokenState = (token: string) => ({
  type: 'SET_TOKEN',
  token
})

export const setUserInfoState = (userInfo: any) => ({
  type: 'SET_USER',
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

export const setUserInfo = (userInfo: any) => async (dispatch) => {
  await AsyncStorage.setItem('userInfo', userInfo)
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