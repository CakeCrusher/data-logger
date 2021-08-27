import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux'
import thunk from 'redux-thunk'

import tokenReducer from './reducers/tokenReducer'
import recordingURIReducer from './reducers/recordingURI'

const combinedReducers = combineReducers({
    token: tokenReducer,
    recordingURI: recordingURIReducer,
})

const store = createStore(
  combinedReducers,
  applyMiddleware(thunk)
)

export { store }