const recordingURIReducer = (state = {
  recordingURI: null
}, action) => {
  switch (action.type) {
    case 'SET_RECORDING_URI':
      return {
        ...state,
        recordingURI: action.uri
      };
    case 'DELETE_RECORDING_URI':
      return {
        ...state,
        recordingURI: null
      }

    default:
      return state;
  }
}

export default recordingURIReducer