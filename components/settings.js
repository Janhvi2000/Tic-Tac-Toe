import React, { useState, useEffect } from 'react';
import { View, TextInput, Button } from 'react-native';
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
            </View>
        </View>
    );
};

export default App;
