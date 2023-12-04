import { StyleSheet } from "react-native-web";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
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
    },
    squareText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    status: {
      fontSize: 24,
      fontWeight: 'bold',
      paddingBottom: 20,
    },
  });
  
  export default styles;
  