// components/Input.js
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const Input = ({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  placeholderTextColor = "#888", 
}) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    width: '100%',
    borderRadius: 6,
    color: "black",
    backgroundColor: '#fff'
  },
});

export default Input;
