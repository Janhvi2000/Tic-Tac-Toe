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
      <Text style={{fontWeight: 'bold', fontSize: 30, marginBottom:10}}>Leaderboard</Text>
      <View style={styles.table}>
        <View style={styles.column}>
          <Text style={styles.header}> User </Text>
          {userStats.map((user, index) => (
            <Text key={index} style={styles.cell}>
              {user.username}
            </Text>
          ))}
        </View>
        <View style={styles.column}>
          <Text style={styles.header}> Games </Text>
          {userStats.map((user, index) => (
            <Text key={index} style={styles.cell}>
              {user.games}
            </Text>
          ))}
        </View>
        <View style={styles.column}>
          <Text style={styles.header}> Wins </Text>
          {userStats.map((user, index) => (
            <Text key={index} style={styles.cell}>
              {user.wins}
            </Text>
          ))}
        </View>
        <View style={styles.column}>
          <Text style={styles.header}> Losses </Text>
          {userStats.map((user, index) => (
            <Text key={index} style={styles.cell}>
              {user.losses}
            </Text>
          ))}
        </View>
        <View style={styles.column}>
          <Text style={styles.header}> Draws </Text>
          {userStats.map((user, index) => (
            <Text key={index} style={styles.cell}>
              {user.draws}
            </Text>
          ))}
        </View>
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
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 20,
    padding: 10,
    width: '80%',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 10,
    flex: 1,
  },
  header: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    textAlign: 'center',
    fontSize: 18,
  },
});

export default Home;
