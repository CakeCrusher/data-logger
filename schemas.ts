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

export const GET_TEST = `
query MyQuery {
  test(order_by: {dateTime: desc}, limit: 10) {
    speech
    dateTime
  }
}
`