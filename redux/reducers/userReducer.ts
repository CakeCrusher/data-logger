import { User } from "../../types"

const userReducer = (state: User = {
  userInfo: {
    id: null,
    name: null,
    email: null
  },
  token: null
}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.user
    case 'SET_USERINFO':
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
          name: null,
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