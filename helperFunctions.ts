import {HASURA_ADMIN_SECRET} from 'react-native-dotenv'

export const fetchGraphQL = async (
  schema: string,
  variables: any = {},
  headers: any = {},
): Promise<any> => {
  const graphql = JSON.stringify({
    query: schema,
    variables,
  });

  const additionalHeaders = headers ? headers : {
    "x-hasura-admin-secret": HASURA_ADMIN_SECRET
  } 

  const requestOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...additionalHeaders
    },
    body: graphql,
  };
  const database_url = "https://data-logger.hasura.app/v1/graphql";
  const res = await fetch(database_url, requestOptions).then((res: any) =>
    res.json()
  );
  
  return res;
};

export const jsonToUrlParams = (json: any) => {
  return Object.keys(json)
    .map(key => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    })
    .join("&");
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transcript } from './types';

export const clearTranscripts = async () => {
  await AsyncStorage.setItem("pendingTranscriptions", JSON.stringify([]));
  return null
}

export const addTranscript = async (transcript) => {
  const transcriptsStr = await AsyncStorage.getItem('pendingTranscriptions')
  let transcripts: Transcript[] = []
  if (transcriptsStr) {
    transcripts = JSON.parse(transcriptsStr)
  }
  transcripts.push(transcript)
  await AsyncStorage.setItem('pendingTranscriptions', JSON.stringify(transcripts))
  console.log(transcripts);
  

  return transcripts
}

export const removeTranscript = async (transcript) => {
  const transcriptsStr = await AsyncStorage.getItem('pendingTranscriptions')
  let transcripts: Transcript[] = []
  if (transcriptsStr) {
    transcripts = JSON.parse(transcriptsStr)
  }
  if (transcripts.length > 0) {
    transcripts = transcripts.filter(t => t.dateTime !== transcript.dateTime)
  }
  await AsyncStorage.setItem('pendingTranscriptions', JSON.stringify(transcripts))
  
  return transcripts
}

export const getTranscripts = async () => {
  const transcriptsStr = await AsyncStorage.getItem('pendingTranscriptions')
  let transcripts: Transcript[] = []
  if (transcriptsStr) {
    transcripts = JSON.parse(transcriptsStr)
  }

  return transcripts
}
