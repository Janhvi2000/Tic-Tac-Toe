import React, { useState, useEffect } from 'react';
import { View, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('user.db');

const App = ({ navigation }) => {
  const [username1, setUsername1] = useState('');
  const [username2, setUsername2] = useState('');
  const [games1, setGames1] = useState(0);
  const [wins1, setWins1] = useState(0);
  const [losses1, setLosses1] = useState(0);
  const [draws1, setDraws1] = useState(0);

  const [games2, setGames2] = useState(0);
  const [wins2, setWins2] = useState(0);
  const [losses2, setLosses2] = useState(0);
  const [draws2, setDraws2] = useState(0);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, games INTEGER, wins INTEGER, losses INTEGER, draws INTEGER, usercolor TEXT)',
        [],
        (_, result) => {
          console.log('Table created successfully');
          // Now, call manageUser after table creation
          manageUser(username1, setGames1, setWins1, setLosses1, setDraws1);
          manageUser(username2, setGames2, setWins2, setLosses2, setDraws2);
        },
        (_, error) => console.log('Error creating table:', error)
      );
    });
  }, []);

  const manageUser = (username, setGames, setWins, setLosses, setDraws) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (_, { rows: { _array } }) => {
          if (_array.length === 0) {
            tx.executeSql(
              'INSERT INTO users (username, games, wins, losses, draws, usercolor) VALUES (?, 0, 0, 0, 0, "black")',
              [username],
              () => {
                console.log('New user created:', { username });
                setGames(0);
                setWins(0);
                setLosses(0);
                setDraws(0);
              }
            );
          } else {
            const { games, wins, losses, draws } = _array[0];
            console.log('Existing user logged in:', { username, games, wins, losses, draws });
            setGames(games);
            setWins(wins);
            setLosses(losses);
            setDraws(draws);
          }
        }
      );
    });
  };

  const navigateToFirstScreen = () => {
    navigation.navigate('FirstScreen', {
      user1: username1,
      user2: username2,
    });
  };

  const handleUserManagement = () => {
    if (username1.trim() !== '' && username2.trim() !== '') {
      manageUser(username1, setGames1, setWins1, setLosses1, setDraws1);
      manageUser(username2, setGames2, setWins2, setLosses2, setDraws2);
      navigateToFirstScreen();
    } else {
      console.log('Please enter both usernames');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        style={{ width: 200, textAlign: 'center', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
        placeholder="Enter player 1"
        onChangeText={(text) => setUsername1(text)}
        value={username1}
      />
      <TextInput
        style={{ width: 200, textAlign: 'center', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
        placeholder="Enter player 2"
        onChangeText={(text) => setUsername2(text)}
        value={username2}
      />
      <Button title="Create/Log In User" onPress={handleUserManagement} />
    </View>
  );
};

export default App;
