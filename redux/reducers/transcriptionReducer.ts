import { TranscriptionState } from "../../types"

const transcriptionReducer = (state: TranscriptionState = {
  transcript: null
}, action) => {
  switch (action.type) {
    case 'SET_TRANSCRIPTION':
      return {
        ...state,
        transcript: action.transcript
      }
    case 'DELETE_TRANSCRIPTION':
      return {
        ...state,
        transcript: null
      }
    default:
      return state
  }
}

export default transcriptionReducer