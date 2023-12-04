import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('user.db');

const Home = () => {
  const [userStats, setUserStats] = useState([]);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM users ORDER BY wins DESC',
        [],
        (_, { rows: { _array } }) => {
          setUserStats(_array);
        }
      );
    });
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
        {userStats.map((user, index) => (
          <View style={styles.row} key={index}>
            <Text>{user.username}</Text>
            <Text>{user.games}</Text>
            <Text>{user.wins}</Text>
            <Text>{user.losses}</Text>
            <Text>{user.draws}</Text>
          </View>
        ))}
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
});

export default Home;
