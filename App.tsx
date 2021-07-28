import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import Screen from './src/components/screen';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Screen />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default App;