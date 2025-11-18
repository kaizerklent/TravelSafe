
//LoginForm.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomButton from '../components/Button';
import CustomInput from '../components/Input';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginPress = () => {
    if (!username || !password) {
      console.log('Please enter both username and password');
      return;
    }

    // If parent provided an onLogin handler, pass credentials to it
    if (onLogin) {
      onLogin(username, password);
      return;
    }

    // Fallback demo logic when no onLogin provided
    if (username === 'kaizerklent.auceran@hcdc.edu.ph' && password === 'kaizer1234') {
      console.log('Login successful!');
    } else {
      console.log('Invalid username or password');
    }
  };

  return (
    <View style={styles.formContainer}>
      <CustomInput
        placeholder="Email"
        value={username}
        onChangeText={setUsername}
      />
      <CustomInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <CustomButton title="Login" onPress={handleLoginPress} />
      <Text style={styles.orText}>OR</Text>
      <CustomButton
        title="Continue with Google"
        onPress={() => console.log('Continue with Google pressed')}
        backgroundColor="#DB4437"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  forgotPassword: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 7,
    marginBottom: 15,
  },
  orText: {
    marginVertical: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginForm;
