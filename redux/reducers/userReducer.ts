const userReducer = (state = {
  userInfo: {
    id: null,
    email: null
  },
  token: null
}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        userInfo: action.userInfo
      }
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.token
      }
    case 'CLEAR_USERINFO':
      return {
        ...state,
        userInfo: {
          id: null,
          email: null
        }
      }
    case 'CLEAR_TOKEN':
      return {
        ...state,
        token: null
      }
    default:
      return state
  }
}

export default userReducer