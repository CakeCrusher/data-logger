import React, {useState} from 'react'
import { Text, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native'
import { TestPayload, ClassifiedTranscription, User } from '../types'

import Layout from './Layout'
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { fetchGraphQL } from '../helperFunctions';
import { SAVE_RUNNING, SAVE_TEST } from '../schemas';
import { connect } from 'react-redux';
import Login from './Login';

type InactedTranscriptionProps = {
  user: User,
  transcript: ClassifiedTranscription | undefined
  disabledSubmit: boolean | undefined,
  onRemoveTranscript: () => void
}

const InactedTranscription = (props: InactedTranscriptionProps) => {
  const [expanded, setExpanded] = useState(false)
  const [transcript, setTranscript] = useState(props.transcript)

  if (!transcript) {
    return null
  }
  if (transcript.table === 'ERROR') {
    return (
      <View style={styles.vLineContainer}>
        <View style={{...styles.vLine, backgroundColor: '#dc3546'}}/>
        <View>
          <View style={styles.mainText}>
            <Text style={styles.header}>Error</Text>
            <Text style={styles.secondary}>Failed to classify or transcribe</Text>
          </View>
          <TouchableOpacity onPress={() => props.onRemoveTranscript()} style={{...styles.deleteButton, width: 40, marginTop: 10}}>
            <Entypo name="cross" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  let description
  switch (transcript.table) {
    case 'testing':
      description = transcript.payload.speech.substring(0,20)
      break
    case 'running':
      description = `${transcript.payload.distance.toString()} meters in ${transcript.payload.time.toString()} seconds.`
      break
    default:
      description = 'ADD DESCRIPTION'
      break

  }

  const date = new Date(transcript.dateTime).toISOString().split('T')[1].split('.')[0]

  const bodyDisplay = expanded ? 'flex': 'none'

  const Fields = () => {
    const Field = ({_key}) => {
      const [value, setValue] = useState(transcript.payload[_key].toString())

      const onChangeField = (e) => {
        const newTranscript = {...transcript}
        newTranscript.payload[_key] = value
        console.log(transcript);
        
        setTranscript(newTranscript)
      }

      const borderColor = expanded ? '#555': 'transparent'

      return (
        <View style={styles.fieldsContainer}>
          <Text style={styles.label}>{_key}: </Text>
          <TextInput style={{...styles.input, borderColor}} onChangeText={setValue} value={value} onSubmitEditing={onChangeField}></TextInput>
        </View>
      )
    }

    // for each object key in the props.transcript.payload make a Field
    const fieldsList = Object.keys(transcript.payload).map((key) => {
      return <Field key={key} _key={key} />
    })

    return (
      <View >
        {fieldsList}
      </View>
    )
  }

  const ActionButtons = () => {
    const deleteTranscription = () => {
      props.onRemoveTranscript()
    }

    const saveTranscription = async () => {
      let schema
      let vars = {
        ...transcript.payload,
        distance: parseInt(transcript.payload.distance),
        dateTime: transcript.dateTime,
        user_id: props.user.userInfo.id
      }
      switch (transcript.table) {
        case 'testing':
          schema = SAVE_TEST
          break;
        case 'running':
          schema = SAVE_RUNNING
          vars = {
            ...vars,
            distance: parseInt(transcript.payload.distance),
          }
          break;
        default:
          console.log('ADD SCHEMA');
          break;
      }
      const jsonRes = await fetchGraphQL(schema, vars, props.user.token)
      console.log(`res for ${transcript.table}: `, jsonRes);
      props.onRemoveTranscript()
    }
    if (!props.user.token) {
      return (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity disabled={props.disabledSubmit} onPress={deleteTranscription} style={{...styles.deleteButton, width: 40}}>
            <Entypo name="cross" size={24} color="white" />
          </TouchableOpacity>
          <Login title="Log in to save" />
        </View>
      )
    } else {
      return (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity disabled={props.disabledSubmit} onPress={deleteTranscription} style={styles.deleteButton}>
            <Entypo name="cross" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity disabled={props.disabledSubmit} onPress={saveTranscription} style={styles.saveButton}>
            <AntDesign name="check" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )
    }
  }

  return (
    <View>
        <View style={styles.vLineContainer}>
          <View style={styles.vLine}/>
          <TouchableOpacity style={styles.headerContainer} onPress={() => setExpanded(!expanded)}>
            <View style={styles.mainText}>
              <Text style={styles.header}>{transcript.table}</Text>
              <Text style={styles.secondary}>{description}</Text>
            </View>
            <View>
              <Text style={styles.date}>{date}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{...styles.vLineContainer, display: bodyDisplay}}>
          <View style={styles.vLine} />
          <View style={styles.bodyContainer}>
            <Fields />
            <ActionButtons />
          </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  vLineContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  vLine: {
    width: 1,
    marginRight: 10,
    backgroundColor: '#fec107'
  },
  headerContainer: {
    height: 50,
    flexDirection: 'row',
    width: '100%',
  },
  mainText: {
    width: '70%'
    // flex: 1,
  },
  header: {
    fontSize: 20,
    color: 'white',
  },
  secondary: {
    fontSize: 14,
    color: 'white',
    opacity: 0.7,
  },
  date: {
    fontSize: 14,
    color: 'white',
    opacity: 0.5,
  },
  contentContainer: {
    flexDirection: 'column',
  },
  bodyContainer: {
    paddingTop: 15,
    flexDirection: 'column',
  },
  fieldsContainer: {
    flexDirection: 'row',
    alignContent: 'flex-end',
  },
  label: {
    width: '30%',
    fontSize: 16,
    color: 'white',
    marginRight: 10,
  },
  input: {
    width: '60%',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 5,
    color: 'white',
    paddingHorizontal: 10,
  },
  actionButtonsContainer: {
    width: '90%',
    marginTop: 15,
    flexDirection: 'row',
    alignContent: 'space-between',
    justifyContent: 'space-around',
  },
  saveButton: {
    padding: 5,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#27a844',
  },
  deleteButton: {
    padding: 5,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#dc3546',
  },
})

const mapStateToProps = (state: any) => ({
  user: state.user
})
const mapDispatchToProps = (dispatch: any) => ({
})


export default connect(mapStateToProps, mapDispatchToProps)(InactedTranscription)