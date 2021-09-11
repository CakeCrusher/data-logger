export const SAVE_TEST = `
mutation MyMutation($dateTime: timestamp!, $speech: String!, $user_id: String!) {
  insert_test(objects: {dateTime: $dateTime, speech: $speech, user_id: $user_id}) {
    returning {
      id
    }
  }
}


`;
// {
//   "speech": "asd",
//   "dateTime": "2021-08-15T10:42:03.931Z",
//   "user_id": "USER_ID"
// }

export const GET_USERINFO = `
query MyQuery {
  auth0 {
    email
    id
    name
  }
}
`

export const GET_TEST = `
query MyQuery {
  test(order_by: {dateTime: desc}, limit: 10) {
    speech
    dateTime
    id
  }
}
`

export const SAVE_RUNNING = `
mutation MyMutation($dateTime: timestamp!, $distance: Int!, $time: Int!, $user_id: String!) {
  insert_running(objects: {distance: $distance, time: $time, dateTime: $dateTime, user_id: $user_id}) {
    returning {
      id
    }
  }
}
`
// {
//   "dateTime": "2021-08-16T01:39:39.293Z",
//   "distance": 1600,
//   "time": 355,
//   "user_id": "USER_ID"
// }

export const GET_RUNNING = `
query MyQuery {
  running(order_by: {dateTime: desc}, limit: 10) {
    dateTime
    distance
    time
    id
  }
}
`

export const MAKE_TABLE = `
mutation MyMutation($fields: [Field]!, $name: String!) {
  createTable(fields: $fields, name: $name) {
    tableName
  }
}
`
// {
//   "fields": [
//     {
//       "label": "isDog",
//       "type": "boolean"
//     },
//     {
//       "label": "responses",
//       "type": "number"
//     }
//   ],
//   "name": "dogrecognition"
// }

export const TRANSCRIPTION = `
query MyQuery($audioBase64: String!) {
  transcription(audioBase64: $audioBase64) {
    transcript
  }
}
`

export const CLASSIFY_TRANSCRIPTION = `
query MyQuery($transcript: String!) {
  classifyTranscript(transcript: $transcript) {
    dateTime
    payload
    table
  }
}
`