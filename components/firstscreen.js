import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, ScrollView } from 'react-native';
import * as SQLite from 'expo-sqlite';

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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.header}>User</Text>
          <Text style={styles.header}>Games</Text>
          <Text style={styles.header}>Wins</Text>
          <Text style={styles.header}>Losses</Text>
          <Text style={styles.header}>Draws</Text>
        </View>
        {user1Stats && (
          <View style={styles.row}>
            <Text>{user1Stats.username}</Text>
            <Text>{user1Stats.games}</Text>
            <Text>{user1Stats.wins}</Text>
            <Text>{user1Stats.losses}</Text>
            <Text>{user1Stats.draws}</Text>
          </View>
        )}
        {user2Stats && (
          <View style={styles.row}>
            <Text>{user2Stats.username}</Text>
            <Text>{user2Stats.games}</Text>
            <Text>{user2Stats.wins}</Text>
            <Text>{user2Stats.losses}</Text>
            <Text>{user2Stats.draws}</Text>
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Game" onPress={navigateToComputerPage} />
        <Button title="Leaderboard" onPress={navigateToLeaderboardPage} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  table: {
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  header: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 10,
  },
});

export default Home;
