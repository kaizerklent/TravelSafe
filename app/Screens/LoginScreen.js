// LoginScreen.js
import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, Alert, TextInput, Modal, TouchableOpacity } from 'react-native';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import LoginForm from '../components/LoginForm';

const LoginScreen = ({ navigation }) => {
  const [resetModal, setResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = async (email, password) => {
    if (!email || !password) {
      Alert.alert("Login Failed", "Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in successfully!");
      navigation.replace('Main'); // change 'Main' to your main/home screen
    } catch (error) {
      console.log("Login error:", error);
      switch (error.code) {
        case 'auth/user-not-found':
          Alert.alert("Login Failed", "No account found with this email.");
          break;
        case 'auth/wrong-password':
          Alert.alert("Login Failed", "Incorrect password.");
          break;
        case 'auth/invalid-email':
          Alert.alert("Login Failed", "Invalid email format.");
          break;
        default:
          Alert.alert("Login Failed", error.message);
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      Alert.alert("Success", "Password reset email sent!");
      setResetModal(false);
      setResetEmail("");
    } catch (error) {
      console.log("Reset error:", error);
      switch (error.code) {
        case "auth/user-not-found":
          Alert.alert("Error", "No account found with this email.");
          break;
        case "auth/invalid-email":
          Alert.alert("Error", "Invalid email format.");
          break;
        default:
          Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/Logo.png')} style={styles.image} />
      <Text style={styles.welcomeText}>Welcome to TravelSafe</Text>

      {/* Login Form Component */}
      <LoginForm onLogin={handleLogin} />

      {/* Forgot Password */}
      <Text style={styles.forgotPassword} onPress={() => setResetModal(true)}>
        Forgot Password?
      </Text>

      {/* Sign Up Link */}
      <Text style={styles.bottomText}>
        Not on TravelSafe yet?{' '}
        <Text style={styles.signUpLink} onPress={() => navigation.navigate('CreateAccScreen')}>
          Sign up
        </Text>.
      </Text>

      {/* Password Reset Modal */}
      <Modal visible={resetModal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your email"
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handlePasswordReset}>
                <Text style={styles.modalButtonText}>Send Reset Link</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#999" }]}
                onPress={() => setResetModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  // 🔹 Forgot Password Style
  forgotPassword: {
    marginTop: 10,
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 14,
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

  // 🔹 Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default LoginScreen;
