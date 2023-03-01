import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import MyStack from './navigation';
import Home from "./screens/Home"
import Quiz from './screens/Quiz';
import Result from './screens/Result';

export default function App() {
  return (
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    paddingTop: 31,
    paddingHorizontal: 16
    // justifyContent: 'center',
  },
  text: {
    fontSize: 26,
  }
});