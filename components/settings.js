import React, { useState, useEffect } from 'react';
import { View, TextInput, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('user.db');

const App = ({ navigation, route }) => {
    const { user1, user2 } = route.params;
    const [userColor1, setUserColor1] = useState('');
    const [userColor2, setUserColor2] = useState('');

    const handleUserManagement = () => {
        updateUserColor(user1, userColor1);
        updateUserColor(user2, userColor2);
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
            <Button title="Update User Colors" onPress={handleUserManagement} />
        </View>
    );
};

export default App;
