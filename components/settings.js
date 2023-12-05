import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('user.db');

const App = ({ navigation, route }) => {
    const { user1, user2 } = route.params;
    const [userColor1, setUserColor1] = useState('');
    const [userColor2, setUserColor2] = useState('');
    const [muteSound, setMuteSound] = useState(false);

    const handleUserManagement = () => {
        if (userColor1 !== '') {
            updateUserColor(user1, userColor1);
            updateUserColor(user2, userColor2);
        }

        updateSoundSetting(user1, muteSound);
        updateSoundSetting(user2, muteSound);
        navigateToFirstScreen();
    };

    const updateUserColor = (username, usercolor) => {
        const lowercaseUserColor = usercolor.toLowerCase();

        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE users SET usercolor = ? WHERE username = ?',
                [lowercaseUserColor, username],
                () => {
                    console.log(`User color updated for ${username}: ${lowercaseUserColor}`);
                },
                (_, error) => console.log(`Error updating user color for ${username}:`, error)
            );
        });
    };

    const updateSoundSetting = (username, soundValue) => {
        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE users SET sound = ? WHERE username = ?',
                [soundValue ? 0 : 1, username],
                () => {
                    console.log(`Sound setting updated for ${username}: ${soundValue ? 'Muted' : 'Unmuted'}`);
                },
                (_, error) => console.log(`Error updating sound setting for ${username}:`, error)
            );
        });
    };

    const resetUserStats = (username) => {
        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE users SET games = 0, wins = 0, losses = 0, draws = 0, usercolor = "black", sound = 1 WHERE username = ?',
                [username],
                () => {
                    console.log(`Stats reset for ${username}`);
                    Alert.alert('Stats Reset', `Game stats for ${username} have been reset.`);
                },
                (_, error) => console.log(`Error resetting stats for ${username}:`, error)
            );
        });
    };

    const resetDatabase = () => {
        db.transaction((tx) => {
            tx.executeSql('DROP TABLE IF EXISTS users');
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, games INTEGER, wins INTEGER, losses INTEGER, draws INTEGER, usercolor TEXT, sound BOOLEAN)'
            );
            console.log('Database reset.');
            Alert.alert('Database Reset', 'The entire database has been reset.');
        });
    };

    const navigateToFirstScreen = () => {
        navigation.navigate('FirstScreen', {
            user1,
            user2,
        });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TextInput
                style={{ width: 200, textAlign: 'center', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
                placeholder="Enter color 1"
                onChangeText={(text) => setUserColor1(text)}
                value={userColor1}
            />
            <TextInput
                style={{ width: 200, textAlign: 'center', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, padding: 10 }}
                placeholder="Enter color 2"
                onChangeText={(text) => setUserColor2(text)}
                value={userColor2}
            />
            <Button title="Save" onPress={handleUserManagement} />

            <View style={{ marginTop: 20 }}>
                <Button
                    title={muteSound ? 'Unmute Sound' : 'Mute Sound'}
                    onPress={() => setMuteSound((prev) => !prev)}
                />
                <Button
                    title="Reset Stats for user 1"
                    onPress={() => resetUserStats(user1)}
                />
                <Button
                    title="Reset Stats for user 2"
                    onPress={() => resetUserStats(user2)}
                />
                <Button
                    title="Reset Entire Database"
                    onPress={() => resetDatabase()}
                />
            </View>
        </View>
    );
};

export default App;
