import React, { Component } from 'react';
import { Button, SafeAreaView, Text, TouchableHighlight, View } from 'react-native';
import { withNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { Audio } from 'expo-av';
import styles from '../assets/styles';

const db = SQLite.openDatabase('user.db');

const newGameState = {
  history: [Array(9).fill(null)],
  stepNumber: 0,
  xIsNext: true,
};

class App extends Component {
  state = {
    ...newGameState,
    user1: null,
    user2: null,
    usercolorx: null,
    usercoloro: null,
    isSoundMuted: false,
  };

  soundObjectWin = new Audio.Sound();
  soundObjectLose = new Audio.Sound();

  initializeGame = async () => {
    const { user1, user2 } = this.props.route.params;
    await this.fetchUserColor(user1, 'usercolorx');
    await this.fetchUserColor(user2, 'usercoloro');
  };

  async componentDidMount() {
    this.initializeGame();
    await this.soundObjectWin.loadAsync(require('../assets/win.mp3'));
    await this.soundObjectLose.loadAsync(require('../assets/loss.mp3'));
    const { user1 } = this.props.route.params;
    await this.fetchSoundSetting(user1);
  }

  async fetchUserColor(username, stateKey) {
    await new Promise((resolve) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT usercolor FROM users WHERE username = ?',
          [username],
          (_, { rows: { _array } }) => {
            if (_array.length > 0) {
              this.setState({ [stateKey]: _array[0].usercolor });
            }
            resolve();
          }
        );
      });
    });
  }

  async fetchSoundSetting(username) {
    await new Promise((resolve) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT sound FROM users WHERE username = ?',
          [username],
          (_, { rows: { _array } }) => {
            if (_array.length > 0) {
              const soundValue = _array[0].sound;
              this.setState({ isSoundMuted: soundValue === 0 });
            }
            resolve();
          }
        );
      });
    });
  }

  async playWinSound() {
    if (!this.state.isSoundMuted) {
        try {
            console.log('Playing win sound...');
            await this.soundObjectWin.playAsync();
            console.log('Win sound played successfully!');
        } catch (error) {
            console.error('Error playing win sound:', error);
        }
    }
}

async playLoseSound() {
    if (!this.state.isSoundMuted) {
        try {
            console.log('Playing lose sound...');
            await this.soundObjectLose.playAsync();
            console.log('Lose sound played successfully!');
        } catch (error) {
            console.error('Error playing lose sound:', error);
        }
    }
}

  onMove(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const currentSquares = history[history.length - 1];
    const newSquares = currentSquares.slice();

    const turn = this.whoseTurn();
    if (newSquares[i] || winner(newSquares)) return null;

    newSquares[i] = turn;
    this.setState(
      {
        history: history.concat([newSquares]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      },
      () => {
        const currentWinner = winner(newSquares);
        if (currentWinner !== undefined) {
          const user1 = this.props.route.params.user1;
          const user2 = this.props.route.params.user2;
          this.updateWinner(currentWinner, user1, user2);
        }
      }
    );
  }

  updateWinner(winner, user1, user2) {
    console.log('winner:', winner);
    db.transaction((tx) => {
      if (winner === null) {
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

        this.playLoseSound();
      } else {
        const winnerUsername = winner === 'X' ? user1 : user2;
        const loserUsername = winner === 'X' ? user2 : user1;

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

        this.playWinSound();
      }
    });
  }

  onUndo() {
    if (this.state.stepNumber > 0) {
      this.setState({
        stepNumber: this.state.stepNumber - 1,
        xIsNext: !this.state.xIsNext,
      });
    }
  }

  onResign() {
    const { user1, user2 } = this.props.route.params;
    const loserUsername = this.whoseTurn();
    console.log('loser: ', loserUsername);
    const winnerUsername = loserUsername === 'X' ? 'O' : 'X';
    console.log('winner:', winnerUsername);
    this.updateWinner(winnerUsername, user1, user2);
    this.props.navigation.navigate('FirstScreen', {
      user1: user1,
      user2: user2,
      updateStats: this.updateStats,
    });
  }

  onNewGame() {
    const { user1, user2 } = this.props.route.params;
    this.setState({
      ...newGameState,
      user1: user1,
      user2: user2,
      usercoloro: null,
      usercolorx: null,
    });
    this.initializeGame();
  }

  whoseTurn() {
    return this.state.xIsNext ? 'X' : 'O';
  }

  render() {
    const user1 = this.props.route.params.user1;
    const user2 = this.props.route.params.user2;
    const history = this.state.history;
    const currentSquares = history[this.state.stepNumber];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.boardContainer}>
          <Board
            squares={currentSquares}
            onMove={(i) => this.onMove(i)}
            usercolorx={this.state.usercolorx}
            usercoloro={this.state.usercoloro}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Status
            turn={this.whoseTurn()}
            winner={winner(currentSquares)}
            user1={user1}
            user2={user2}
            usercolorx={this.state.usercolorx}
            usercoloro={this.state.usercoloro}
          />
          <View style={styles.buttonTable}>
            <View style={styles.buttonRow}>
              <Button
                title="Undo"
                onPress={() => this.onUndo()}
                disabled={this.state.stepNumber === 0}
              />
              <Button title="Resign" onPress={() => this.onResign()} />
            </View>
            <View style={styles.buttonRow}>
              <Button title="Start new game" onPress={() => this.onNewGame()} />
              <Button
                title="Home"
                onPress={() =>
                  this.props.navigation.navigate('FirstScreen', {
                    user1: user1,
                    user2: user2,
                    updateStats: this.updateStats,
                  })
                }
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const Board = ({ squares, onMove, usercolorx, usercoloro }) => {
  return (
    <View style={styles.board}>
      <Row
        squares={squares}
        startIndex={0}
        onMove={onMove}
        usercolorx={usercolorx}
        usercoloro={usercoloro}
      />
      <Row
        squares={squares}
        startIndex={3}
        onMove={onMove}
        usercolorx={usercolorx}
        usercoloro={usercoloro}
      />
      <Row
        squares={squares}
        startIndex={6}
        onMove={onMove}
        usercolorx={usercolorx}
        usercoloro={usercoloro}
      />
    </View>
  );
};

const Row = ({ squares, startIndex, onMove, usercolorx, usercoloro }) => {
  return (
    <View style={styles.boardRow}>
      <Square
        label={squares[startIndex]}
        onPress={() => onMove(startIndex)}
        usercolor={squares[startIndex] === 'X' ? usercolorx : usercoloro}
      />
      <Square
        label={squares[startIndex + 1]}
        onPress={() => onMove(startIndex + 1)}
        usercolor={squares[startIndex + 1] === 'X' ? usercolorx : usercoloro}
      />
      <Square
        label={squares[startIndex + 2]}
        onPress={() => onMove(startIndex + 2)}
        usercolor={squares[startIndex + 2] === 'X' ? usercolorx : usercoloro}
      />
    </View>
  );
};

const Square = ({ label, onPress, usercolor }) => {
  return (
    <TouchableHighlight style={styles.square} onPress={onPress}>
      <Text style={[styles.squareText, { color: usercolor }]}>{label}</Text>
    </TouchableHighlight>
  );
};

const Status = ({ turn, winner, user1, user2, usercolor }) => {
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
      <Text style={[styles.squareText, { color: usercolor }]}>{text}</Text>
    </View>
  );
};

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
  if (squares.indexOf(null) === -1) return null;
  return undefined;
};

export default App;
