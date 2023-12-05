import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FirstScreen from './components/firstscreen';
import Computer from './components/twoplayer';
import User from './components/user';
import Leaderboard from './components/leaderboard';
import Settings from './components/settings';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="User"
        screenOptions={{
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen
          name="User"
          component={User}
          options={{ title: 'TicTacToe' }}
        />
        <Stack.Screen
          name="FirstScreen"
          component={FirstScreen}
          options={{ title: 'TicTacToe' }}
        />
        <Stack.Screen
          name="Computer"
          component={Computer}
          options={{ title: 'TicTacToe' }}
        />
        <Stack.Screen
          name="Leaderboard"
          component={Leaderboard}
          options={{ title: 'TicTacToe' }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ title: 'TicTacToe' }}
        />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;