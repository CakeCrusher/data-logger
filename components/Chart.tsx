import React, {useState} from 'react'
import { connect } from 'react-redux'
import { LineChart } from "react-native-chart-kit";
import { Dimensions, View, StyleSheet, TextInput, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const Chart = (props) => {
  const [yAxis, setYAxis] = useState('')

  // flip a list
  const flip = (list: any) => {
    let newList: any = []
    for (let i = list.length - 1; i >= 0; i--) {
      newList.push(list[i])
    }
    return newList
  }
  const dataItems = flip(props.dataItems)

  if (dataItems.length === 0) {
    return null
  }

  const allDataPoints = Object.keys(dataItems[0])
  const numericDataPoints = allDataPoints.filter(key => {
    return typeof dataItems[0][key] === 'number' ? true : false
  })
  const dataPointItems = numericDataPoints.map(key => {
    return {
      label: key,
      value: key
    }
  })

  if (numericDataPoints.length === 0) {
    return null
  }
  
  const labels = dataItems.map(dataItem => {
    const date = new Date(dataItem.dateTime)
    const day = date.getDate()
    const month = date.getMonth() + 1
    return `${month}/${day}`
  })
  
  const data = dataItems.map(dataItem => {
    return yAxis === '' ? dataItem[numericDataPoints[0]] : dataItem[yAxis]
  })

  const chartConfig = {
    backgroundGradientFrom: "white",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#222",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255,255,255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };
  const screenWidth = Dimensions.get("window").width;
  const dataConfig = {
    labels,
    datasets: [
      {
        data,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: [yAxis === '' ? numericDataPoints[0] : yAxis] // optional
  };
  
  return (
    <View style={styles.chartContainer}>
      <View style={styles.fieldsContainer}>
        <Text style={styles.label}>Y-axis: </Text>
        <View style={styles.selectorWrapper}>
          <RNPickerSelect
            placeholder={{label: 'Data point', value: 'Data point'}}
            style={{ inputAndroid: { color: 'white', padding: 20 } }}
            onValueChange={(value: string) => setYAxis(value)}
            items={dataPointItems}
            value={yAxis}
          />
        </View>
      </View>
      <LineChart
        data={dataConfig}
        width={(screenWidth/100)*85}
        height={220}
        chartConfig={chartConfig}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  chartContainer: {
    marginVertical: 20,
  },
  fieldsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    width: '30%',
    fontSize: 16,
    color: 'white',
    marginRight: 10,
  },
  selectorWrapper: {
    width: '60%',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 5,
    color: 'white',
    paddingHorizontal: 10,
  },
})

const mapStateToProps = (state: any) => ({
})
const mapDispatchToProps = (dispatch: any) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Chart)