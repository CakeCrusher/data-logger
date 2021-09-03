import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux'
import thunk from 'redux-thunk'

import tokenReducer from './reducers/tokenReducer'
import userReducer from './reducers/userReducer'
import recordingURIReducer from './reducers/recordingURI'

const combinedReducers = combineReducers({
  user: userReducer,
  recordingURI: recordingURIReducer,
})

const store = createStore(
  combinedReducers,
  applyMiddleware(thunk)
)

export { store }