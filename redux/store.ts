import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux'
import thunk from 'redux-thunk'

import tokenReducer from './reducers/tokenReducer'
import userReducer from './reducers/userReducer'
import recordingURIReducer from './reducers/recordingURI'
import transcriptionReducer from './reducers/transcriptionReducer'

const combinedReducers = combineReducers({
  user: userReducer,
  recordingURI: recordingURIReducer,
  transcription: transcriptionReducer,
})

const store = createStore(
  combinedReducers,
  applyMiddleware(thunk)
)

export { store }