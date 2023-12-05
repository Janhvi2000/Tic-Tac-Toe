import { StyleSheet } from "react-native-web";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
    backgroundColor: 'white',
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
  buttonTable: {
    flexDirection: 'row', 
    width: '60%', 
    paddingHorizontal: 20, 
  },
  buttonRow: {
    flexDirection: 'column',
    marginBottom: 10,
    width: '80%', 
  },
  buttonCell: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    textAlign: 'center', 
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
    paddingHorizontal: 2,
  },
  cell: {
    textAlign: 'center',
    fontSize: 18,
    paddingHorizontal: 2,
  },
});

export default styles;
