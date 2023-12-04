import React, { Component } from 'react';
import { Button, SafeAreaView, Text, TouchableHighlight, View, StyleSheet } from 'react-native';
import { withNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('user.db');

const newGameState = {
  squares: Array(9).fill(null),
  xIsNext: true,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = newGameState;
  }

  whoseTurn() {
    return this.state.xIsNext ? 'X' : 'O';
  }

  onNewGame() {
    this.setState(newGameState);
  }

  onMove(i) {
    let newSquares = this.state.squares.slice();
    const turn = this.whoseTurn();
    if (this.state.squares[i] || winner(this.state.squares)) return null;
    newSquares[i] = turn;
    this.setState(
      {
        squares: newSquares,
        xIsNext: !this.state.xIsNext,
      },
      () => {
        const currentWinner = winner(this.state.squares);
        if (currentWinner !== undefined) {
          const user1 = this.props.route.params.user1;
          const user2 = this.props.route.params.user2;
          this.updateWinner(currentWinner, user1, user2);
        }
      }
    );
  }

  updateWinner(winner, user1, user2) {
    console.log(user1)
    console.log(user2)
    console.log(winner)
    db.transaction((tx) => {
      if (winner === null) {
        // It's a draw, update draws for both users
        tx.executeSql(
          'UPDATE users SET games = games + 1, draws = draws + 1 WHERE username = ? OR username = ?',
          [user1, user2],
          (_, result) => {
            if (result.rowsAffected > 0) {
              console.log('Draw updated in the database for both users.');
            } else {
              console.error('Failed to update draw in the database.');
            }
          },
          (_, error) => {
            console.error('Error updating draw in the database:', error);
          }
        );
      } else {
        const winnerUsername = winner === user1 ? user2 : user1;
        const loserUsername = winner === user1 ? user1 : user2;
  
        tx.executeSql(
          'UPDATE users SET games = games + 1, wins = wins + 1 WHERE username = ?',
          [winnerUsername],
          (_, winnerResult) => {
            if (winnerResult.rowsAffected > 0) {
              console.log(`Winner (${winnerUsername}) updated in the database!`);
            } else {
              console.error(`Failed to update winner (${winnerUsername}) in the database.`);
            }
          },
          (_, winnerError) => {
            console.error('Error updating winner in the database:', winnerError);
          }
        );
  
        tx.executeSql(
          'UPDATE users SET games = games + 1, losses = losses + 1 WHERE username = ?',
          [loserUsername],
          (_, loserResult) => {
            if (loserResult.rowsAffected > 0) {
              console.log(`Loser (${loserUsername}) updated in the database!`);
            } else {
              console.error(`Failed to update loser (${loserUsername}) in the database.`);
            }
          },
          (_, loserError) => {
            console.error('Error updating loser in the database:', loserError);
          }
        );
      }
    });
  }
  
  

  render() {
    const user1 = this.props.route.params.user1;
    const user2 = this.props.route.params.user2;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.boardContainer}>
          <Board squares={this.state.squares} onMove={(i) => this.onMove(i)} />
        </View>
        <View style={styles.buttonContainer}>
        <Status
          turn={this.whoseTurn()}
          winner={winner(this.state.squares)}
          user1={user1}
          user2={user2}
        />
          <Button title="Start new game" onPress={() => this.onNewGame()} />
          <Button
            title="Home"
            onPress={() =>
              this.props.navigation.navigate('FirstScreen', {
                user1: user1,
                user2: user2,
                updateStats: this.updateStats, // Pass the updateStats function as a callback
              })
            }
          />
        </View>
      </SafeAreaView>
    );
  }
}

const Board = ({ squares, onMove }) => {
  return (
    <View style={styles.board}>
      <Row squares={squares} startIndex={0} onMove={onMove} />
      <Row squares={squares} startIndex={3} onMove={onMove} />
      <Row squares={squares} startIndex={6} onMove={onMove} />
    </View>
  );
};

const Row = ({ squares, startIndex, onMove }) => {
  return (
    <View style={styles.boardRow}>
      <Square label={squares[startIndex]} onPress={() => onMove(startIndex)} />
      <Square label={squares[startIndex + 1]} onPress={() => onMove(startIndex + 1)} />
      <Square label={squares[startIndex + 2]} onPress={() => onMove(startIndex + 2)} />
    </View>
  );
};

const Square = ({ label, onPress }) => {
  return (
    <TouchableHighlight style={styles.square} onPress={onPress}>
      <Text style={styles.squareText}>{label}</Text>
    </TouchableHighlight>
  );
};

const Status = ({ turn, winner, user1, user2 }) => {
  let text = '';
  if (winner === null) {
    text = 'Tie game :-/';
  } else if (winner === undefined) {
    text = turn === 'X' ? user1 : user2;
    text += "'s turn";
  } else {
    text = winner === 'X' ? user1 : user2;
    text += ' wins!';
  }

  return (
    <View style={styles.statusContainer}>
      <Text style={styles.squareText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Added a white background to match the first snippet
  },
  boardContainer: {
    alignItems: 'center',
  },
  boardRow: {
    flexDirection: 'row',
  },
  square: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: 'white', // Added a white background to match the first snippet
  },
  squareText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  statusContainer: {
    marginBottom: 20, 
  },
});

const winner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if (squares.indexOf(null) === -1) return null; // tie game
  return undefined;
};

export default App;