import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';


const Profil = () => {
  return(
    <View style={styles.container}>
      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout"/>
    </View>
  );
}

export default Profil

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
