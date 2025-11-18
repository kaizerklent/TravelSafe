// LoginScreen.js
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import LoginForm from '../components/LoginForm';

const LoginScreen = ({ navigation }) => {
  const handleSuccessfulLogin = () => {
    console.log('Navigate to Dashboard page here...');
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/Logo.png')}
        style={styles.image}
      />
      <Text style={styles.welcomeText}>Welcome to TravelSafe</Text>

      <LoginForm onLogin={handleSuccessfulLogin} />

      <Text style={styles.bottomText}>
        By continuing, you agree to TravelSafe{"'"}s Terms of Service and Privacy Policy.{'\n\n'}
        Not on TravelSafe yet?{' '}
        <Text
          style={styles.signUpLink}
          onPress={() => navigation.navigate('CreateAccScreen')}
        >
          Sign up
        </Text>.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFADD',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bottomText: {
    marginTop: 17,
    fontSize: 12,
    textAlign: 'center',
  },
  signUpLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
