import { StyleSheet } from "react-native-web";

const customStyles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    table: {
      flexDirection: 'column',
      borderWidth: 1,
      borderColor: 'black',
      marginBottom: 20,
      padding: 10,
      width: '80%',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 10,
      marginHorizontal: 10,
    },
    cell: {
      textAlign: 'center',
      fontSize: 18,
      flex: 1,
      paddingHorizontal: 2,
    },
    cellHeader: {
      fontWeight: 'bold',
      textAlign: 'center',
      flex: 1,
      paddingHorizontal: 2,
    },
    header: {
      fontWeight: 'bold',
      fontSize: 30,
      marginBottom: 10,
    },
    buttonContainer: {
      padding: 10,
    },
  });

  export default customStyles;