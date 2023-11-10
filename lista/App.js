import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from  "@react-navigation/native-stack";

import HomeScreen from './src/homescreen/HomeScreen';
import CreateList from './src/CreateListScreen/CreateList';
import CreateTopic from './src/CreateTopicScreen/CreateTopic';
import TopicsListScreen from './src/TopicListScreen/TopicList';
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateList" component={CreateList} />
        <Stack.Screen name="CreateTopic" component={CreateTopic} />
        <Stack.Screen name="TopicList" component={TopicsListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;