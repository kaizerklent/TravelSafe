// components/Checkbox.js

import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const Checkbox = ({ label, value, onValueChange }) => {
  return (
    <View style={styles.container}>
      <Switch
        value={value}
        onValueChange={onValueChange}
      />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
});

export default Checkbox;
