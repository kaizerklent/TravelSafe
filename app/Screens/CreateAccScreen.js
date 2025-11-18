import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CheckBox from 'expo-checkbox';
import Input from '../components/Input';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const CreateAccountScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleCreateAccount = async () => {
    if (!email || !password || !username || !fullName) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      Alert.alert("Error", "You must agree to the Terms and Conditions.");
      return;
    }

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set full name in Firebase Auth displayName
      await updateProfile(user, {
        displayName: fullName,
      });

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        fullName: fullName,
        email: email.toLowerCase(),
        createdAt: serverTimestamp(),
      });

      // ✅ Success alert and return to LoginScreen with email pre-filled
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login", { email: email })
        }
      ]);

    } catch (error) {
      console.log(error);

      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "Email is already registered.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Invalid email format.");
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/Logo.png')} style={styles.image} />

      <View style={styles.formContainer}>
        <Input placeholder="Username" value={username} onChangeText={setUsername} />
        <Input placeholder="Full Name" value={fullName} onChangeText={setFullName} />
        <Input placeholder="Email" value={email} onChangeText={setEmail} />
        <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <Input placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

        <View style={styles.checkboxContainer}>
          <CheckBox value={agreeTerms} onValueChange={setAgreeTerms} color={agreeTerms ? '#007BFF' : undefined} />
          <Text style={styles.checkboxLabel}>I agree with the Terms and Conditions</Text>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateAccount}>
          <Text style={styles.createButtonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>

        <Text style={styles.loginLink}>
          Already have an account?{' '}
          <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
            Log in
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default CreateAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#FFFADD',
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  formContainer: {
    width: '85%',
    alignSelf: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
    color: '#333',
  },
  loginText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});
