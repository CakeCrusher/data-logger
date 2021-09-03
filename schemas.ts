export const SAVE_TEST = `
mutation MyMutation($dateTime: timestamp!, $speech: String!) {
  insert_test(objects: {dateTime: $dateTime, speech: $speech}) {
    returning {
      dateTime
      speech
      id
    }
  }
}

`;
// {
//   "speech": "asd",
//   "dateTime": "2021-08-15T10:42:03.931Z"
// }

export const GET_USERINFO = `
  query MyQuery {
    auth0 {
      email
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
mutation MyMutation($dateTime: timestamp!, $distance: Int!, $time: Int!) {
  insert_running(objects: {distance: $distance, time: $time, dateTime: $dateTime}) {
    returning {
      id
    }
  }
}
`
// {
//   "dateTime": "2021-08-16T01:39:39.293Z",
//   "distance": 1600,
//   "time": 355
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