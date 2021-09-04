import AsyncStorage from '@react-native-async-storage/async-storage'

export const getToken = (token) => ({
  type: 'GET_TOKEN',
  token,
})

export const saveToken = (token) => ({
  type: 'SAVE_TOKEN',
  token,
})

export const removeToken = () => ({
  type: 'REMOVE_TOKEN',
});

export const loading = (bool) => ({
  type: 'LOADING',
  isLoading: bool,
});

export const error = (error) => ({
  type: 'ERROR',
  error,
});

export const getUserToken = () => async (dispatch) => {
  dispatch(loading(false))
  const token = await AsyncStorage.getItem('userToken')
  if (token) {
    dispatch(getToken(token))
  } else {
    dispatch(error('No token found'))
  }
}

export const saveUserToken = (token) => async (dispatch) => {
  await AsyncStorage.setItem('userToken', token)
  dispatch(loading(false))
  dispatch(saveToken(token))
}

export const removeUserToken = () => async (dispatch) => {
  await AsyncStorage.removeItem('userToken')
  dispatch(loading(false))
  dispatch(removeToken())
}
