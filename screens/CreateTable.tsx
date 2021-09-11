import React, {useState, useEffect} from 'react'
import { StyleSheet, View, Button, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux'
import RecordButton from '../components/RecordButton'
import { Field } from '../types'
import Layout from '../components/Layout'
import InactedTranscription from '../components/InactedTranscription'
import { MAKE_TABLE } from '../schemas'
import { fetchGraphQL } from '../helperFunctions'
type FieldWithInput = Field & {input: string}
const CreateTable = (props: any) => {
  const [tableName, setTableName] = useState('')
  const [fields, setFields] = useState<FieldWithInput[]>([])
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [label, setLabel] = useState('')
  const [usedWords, setUsedWords] = useState<string[]>([])
  const transcriptWords = props.transcription.transcript ? props.transcription.transcript.split(' ') : []

  const navigation = useNavigation()

  const commandWords = transcriptWords.map((word: string) => {
    const onWordPress = () => {
      if (selectedWords.includes(word)) {
        setSelectedWords(selectedWords.filter((w: string) => w !== word))
      } else {
        setSelectedWords([...selectedWords, word])
      }
    }
    if (usedWords.includes(word)) {
      return (
        <TouchableOpacity disabled={true} key={word} onPress={onWordPress}>
          <Text style={{...styles.commandWord, opacity: 0.5, paddingHorizontal: 3, backgroundColor: selectedWords.includes(word) ? 'red' : '#ffffff00'}}>{word}</Text>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity key={word} onPress={onWordPress}>
          <Text style={{...styles.commandWord, paddingHorizontal: 3, backgroundColor: selectedWords.includes(word) ? 'red' : '#ffffff00'}}>{word}</Text>
        </TouchableOpacity>
      )
    }
  })

  const Command = () => {
    if (props.transcription.transcript) {
      return (
        <View>
          <Text style={styles.secondaryText}>Select segment to log: </Text>
          <View style={styles.commandContainer}>
            {commandWords}
          </View>
        </View>
      )
    } else {
      return null
    }
  }

  const AddField = () => {
    const fieldType = parseInt(selectedWords.join(' ')) ? 'number' : 'string'
    const onAddField = () => {
      setFields([...fields, {label: label, type: fieldType, input: selectedWords.join(' ')}])
      setLabel('')
      setSelectedWords([])
      setUsedWords([...usedWords, ...selectedWords])
    }
    if (label) {
      return (
        <TouchableOpacity onPress={onAddField}>
          <Text style={{...styles.navButton, backgroundColor: '#27a844'}}>Add field</Text>
        </TouchableOpacity>
      )
    } else {
      return null
    }

  }

  const labelComponent = selectedWords.length ? (
    <View style={styles.labelContainer}>
      <TextInput style={styles.tableTitleInput} placeholder={'Label'} placeholderTextColor="#555" onChangeText={setLabel} value={label} onSubmitEditing={() => {}}></TextInput>
      <Text style={styles.labelText}>: {selectedWords.join(' ')}</Text>
    </View>
  ) : null

  const fieldsObject = {}
  fields.forEach((field: FieldWithInput) => fieldsObject[field.label] = field.input)
  const classifiedTranscription = {
    table: tableName,
    dateTime: new Date().toISOString(),
    payload: fieldsObject
  }

  const ExampleOfTable = () => {
    if (tableName && fields.length) {
      return (
        <View style={styles.exampleContainer}>
          <Text style={styles.titleLabel}>Example:</Text>
          <InactedTranscription key={JSON.stringify(classifiedTranscription)} onRemoveTranscript={() => {}} transcript={classifiedTranscription} disabledSubmit={true} />
        </View>
      )
    } else {
      return null
    }
  }


  const CreateTable = () => {
    const fieldType = parseInt(selectedWords.join(' ')) ? 'number' : 'string'
    const onCreateTable = async () => {
      const variables = {
        fields: fields.map((field: Field) => ({label: field.label.toLocaleLowerCase(), type: field.type})),
        name: tableName.toLocaleLowerCase()
      }
      const createTable = await fetchGraphQL(MAKE_TABLE, variables, props.user.token)
      console.log('createTable: ', createTable);
      
      setTableName('')
      setFields([])
      setLabel('')
      setSelectedWords([])
      setUsedWords([])
    }
    if (tableName && fields.length) {
      return (
        <TouchableOpacity onPress={onCreateTable}>
          <Text style={{...styles.navButton, backgroundColor: '#27a844', width: '100%'}}>Create table</Text>
        </TouchableOpacity>
      )
    } else {
      return null
    }

  }

  const RecordCommand = () => {
    if (tableName) {
      return (
        <View>
          <Text style={styles.titleLabel}>Field identification: </Text>
          <Text style={styles.secondaryText}>Provide an example command: </Text>
          <View style={styles.buttonContainer}>
            <RecordButton/>
          </View>
        </View>
      )
    } else {
      return null
    }
  }

  return (
    <Layout>
      <ScrollView>
        <ExampleOfTable/>
        <Text style={styles.titleLabel}>Table Name: </Text>
        <View style={styles.tableNameContainer}>
          <TextInput style={styles.tableTitleInput} placeholder={'Table name'} placeholderTextColor="#555" onChangeText={setTableName} value={tableName} onSubmitEditing={() => {}}></TextInput>
        </View>
        <View style={styles.fieldIdentificationContainer}>
          <RecordCommand/>
          <Command/>
          {labelComponent}
          {/* <Label/> */}
          <AddField/>
          <CreateTable/>
        </View>

        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Record' as any)}>
            <Text style={styles.navButton}>Record</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Data' as any)}>
            <Text style={styles.navButton}>Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  exampleContainer: {
    opacity: 0.7,
    padding: 10,
  },
  commandWord: {
    fontSize: 15,
    color: 'white',
  },
  labelContainer: {
    flexDirection: 'row',
  },
  commandContainer: {
    backgroundColor: '#444',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  secondaryText: {
    fontSize: 20,
    color: 'white',
    opacity: 0.7,
    marginTop: 20,
    marginBottom: 10
  },
  labelText: {
    marginLeft: 5,
    fontSize: 20,
    color: 'white',
    opacity: 0.7,
  },
  buttonContainer: {
    height: 100,
    width: '100%',
  },
  
  fieldContainer: {
    padding: 10,
    flexDirection: 'row',
    alignContent: 'center',
  },
  tableNameContainer: {
    padding: 10,
    flexDirection: 'row',
    marginVertical: 20,
    alignContent: 'center',
  },
  titleLabel: {
    color: 'white',
    fontSize: 20,
  },
  tableTitleInput: {
    width: '50%',
    borderWidth: 1,
    fontSize: 20,
    borderColor: '#555',
    borderRadius: 5,
    color: 'white',
    paddingHorizontal: 10,
  },
  fieldIdentificationContainer: {
    padding: 10,
  },
  navBar: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 40,
    justifyContent: 'flex-end',
  },
  navButton: {
    fontSize: 16,
    color: 'white',
    paddingVertical: 6,
    paddingHorizontal: 20,
    backgroundColor: '#007aff',
    alignSelf: 'flex-end',
    borderRadius: 5,
    margin: 5,
  }
})

const mapStateToProps = (state: any) => ({
  user: state.user,
  transcription: state.transcription
})
const mapDispatchToProps = (dispatch: any) => ({
  // getUser: () => dispatch(getUser()),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateTable)