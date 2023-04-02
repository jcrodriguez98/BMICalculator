import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, SafeAreaView, ScrollView, TextInput, Pressable } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const key = '@MyApp: key';

export default class App extends Component {
  state = {
    height: '',
    weight: '',
    showBMI: false,
    BMI: 0
  };

  constructor(props) {
    super(props);
    this.onLoad();
  }
  
  onLoad = async () => {
    try {
      const height = await AsyncStorage.getItem(key);
      this.setState({ height });
    } catch (error) {
      Alert.alert('Error', 'There was an error while loading the data');
    }
  } 
  
  calculateBMI = (weight, height) => {
    BMI = 703 * (weight / (height * height));
    return BMI.toFixed(2);
  }

  saveHeight = async () => {
    const { height } = this.state;
    this.setState({showBMI: true})

    try {
      await AsyncStorage.setItem(key, height);
      Alert.alert('Saved', 'Successfully saved on device');
    } catch (error) {
      Alert.alert('Error', 'There was an error while saving the data');
    }
  }
  
  onChangeWeight = (weight) => {
    this.setState({ weight, showBMI: false });
  }
  
  onChangeHeight = (height) => {
    this.setState({ height, showBMI: false });
  }

  onCalculate = () => {
    const { weight, height } = this.state;
    this.setState({ BMI: this.calculateBMI(weight, height), showBMI: true }, () => this.saveHeight());
  }

  render() {
    const { weight, height, showBMI, BMI } = this.state

    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.toolbar}>BMI Calculator</Text>
        <ScrollView style={styles.scrollview}>
          <TextInput
            style={styles.placeholder}
            onChangeText={this.onChangeWeight}
            value={weight}
            keyboardType="numeric"
            placeholder='Weight in Pounds'
          />
          <TextInput
            style={styles.placeholder} 
            value={height}
            onChangeText={this.onChangeHeight}
            keyboardType="numeric" 
            placeholder='Height in Inches'
          />
          <Pressable style={styles.button} onPress={this.onCalculate}>
            <Text style={styles.buttonText}>Compute BMI</Text>         
          </Pressable>
          {
          (showBMI) ?
          <Text style={styles.BMI}>Body Mass Index is {BMI}</Text> :
          <Text style={styles.BMI}> </Text> 
          }
          <Text style={styles.assignmentTitle}>Assessing Your BMI</Text>
          <Text style={styles.assignment}>Underweight: less than 18.5</Text>
          <Text style={styles.assignment}>Healthy: 18.5 to 24.9</Text>
          <Text style={styles.assignment}>Overweight: 25.0 to 29.9</Text>
          <Text style={styles.assignment}>Obese: 30.0 or higher</Text>
        </ScrollView>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    backgroundColor: '#f4511e',
    color: '#fff',
    textAlign: 'center',
    padding: 25,
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollview: {
    flex: 1,
    padding: 10
  },
  placeholder: {
    backgroundColor: '#ecf0f1',
    fontSize: 24,
    fontWeight: 'bold',
    borderRadius: 3,
    height: 40,
    padding: 5,
    marginBottom: 10,
    flex: 1,
  },
  button: {
    backgroundColor: '#34495e',
    padding: 10,
    borderRadius: 3,
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 24,
    textAlign: 'center',
    padding: 10,
    color: '#fff',
  },
  BMI: {
    fontSize: 28,
    textAlign: 'center',
    padding: 30,
  },
  assignmentTitle: {
    fontSize: 20,
    textAlign: 'left',
    paddingLeft: 10,
    paddingTop: 30
  },
  assignment: {
    fontSize: 20,
    textAlign: 'left',
    paddingLeft: 30,
  },
});
