import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import customStyles from '../assets/customStyles';

const db = SQLite.openDatabase('user.db');

const Home = ({ navigation, route }) => {
  const [user1Stats, setUser1Stats] = useState(null);
  const [user2Stats, setUser2Stats] = useState(null);
  const { user1, user2 } = route.params;

  useEffect(() => {
    console.log('Page opened or route params changed');
    if (user1 && user2) {
      updateStats();
    }
    route.params?.updateStats?.();
  }, [route.params, user1, user2]);

  const updateStats = () => {
    getUserStats(user1, setUser1Stats);
    getUserStats(user2, setUser2Stats);
  };

  const getUserStats = (username, setUserStats) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            setUserStats(_array[0]);
          }
        }
      );
    });
  };

  const navigateToComputerPage = () => {
    navigation.navigate('Computer', {
      user1: user1,
      user2: user2,
    });
  };

  const navigateToLeaderboardPage = () => {
    navigation.navigate('Leaderboard');
  };

  return (
    <ScrollView contentContainerStyle={customStyles.container}>
      <Text style={customStyles.header}>Users Stats</Text>
      <View style={customStyles.table}>
        <View style={customStyles.row}>
          <Text style={customStyles.cellHeader}>User</Text>
          <Text style={customStyles.cellHeader}>Games</Text>
          <Text style={customStyles.cellHeader}>Wins</Text>
          <Text style={customStyles.cellHeader}>Losses</Text>
          <Text style={customStyles.cellHeader}>Draws</Text>
        </View>
        <View style={customStyles.row}>
          {user1Stats && (
            <>
              <Text style={customStyles.cell}>{user1}</Text>
              <Text style={customStyles.cell}>{user1Stats.games}</Text>
              <Text style={customStyles.cell}>{user1Stats.wins}</Text>
              <Text style={customStyles.cell}>{user1Stats.losses}</Text>
              <Text style={customStyles.cell}>{user1Stats.draws}</Text>
            </>
          )}
        </View>
        <View style={customStyles.row}>
          {user2Stats && (
            <>
              <Text style={customStyles.cell}>{user2}</Text>
              <Text style={customStyles.cell}>{user2Stats.games}</Text>
              <Text style={customStyles.cell}>{user2Stats.wins}</Text>
              <Text style={customStyles.cell}>{user2Stats.losses}</Text>
              <Text style={customStyles.cell}>{user2Stats.draws}</Text>
            </>
          )}
        </View>
      </View>
      <View style={customStyles.buttonContainer}>
        <Button title="Game" onPress={navigateToComputerPage} />
        <Button title="Leaderboard" onPress={navigateToLeaderboardPage} />
      </View>
    </ScrollView>
  );
};
export default Home;
