export type ClassifiedTranscription = {
  table: string;
  dateTime: string;
  payload: any;
}

export type TestPayload = {
  dateTime: string;
  speech: string;
}

export type UserInfo = {
  id: string | null,
  name: string | null,
  email: string | null
}

export type User = {
  userInfo: UserInfo,
  token: string | null,
}
export type TranscriptionState = {
  transcript: string | null
}

export type Field = {
  label: string,
  type: 'number' | 'string'
}