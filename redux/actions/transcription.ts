export const setTranscription = (transcript: string) => ({
  type: 'SET_TRANSCRIPTION',
  transcript,
})

export const deleteTranscription = () => ({
  type: 'DELETE_TRANSCRIPTION',
})