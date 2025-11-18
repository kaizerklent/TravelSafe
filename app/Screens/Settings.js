// Settings.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';

const Settings = ({ navigation }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@email.com');
  const [bio, setBio] = useState('Traveler | Foodie | Explorer');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);
  const [autoSave, setAutoSave] = useState(false);

  // Handle profile picture change
  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photos to change profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    // Simulate saving changes
    Alert.alert('Success', 'Your profile has been updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: () => {
            // Navigate to login screen
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to default. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            setNotifications(true);
            setDarkMode(false);
            setLocationServices(true);
            setAutoSave(false);
            Alert.alert('Reset Complete', 'All settings have been reset to default.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <CustomHeader
        title="Settings"
        onMenuPress={() => navigation.toggleDrawer()}
      />

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          
          <View style={styles.profilePicContainer}>
            <TouchableOpacity onPress={handlePickImage} style={styles.profilePicWrapper}>
              {profilePic ? (
                <Image source={{ uri: profilePic }} style={styles.profilePic} />
              ) : (
                <View style={styles.placeholderPic}>
                  <Ionicons name="person" size={40} color="#999" />
                </View>
              )}
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={16} color="#FFF" />
              </View>
            </TouchableOpacity>
            
            <Text style={styles.profileHint}>Tap to change photo</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell something about yourself..."
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={22} color="#666" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive updates and alerts</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notifications ? '#22668D' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={22} color="#666" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Dark Mode</Text>
                <Text style={styles.settingDescription}>Switch to dark theme</Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={darkMode ? '#22668D' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="location-outline" size={22} color="#666" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Location Services</Text>
                <Text style={styles.settingDescription}>Share your location</Text>
              </View>
            </View>
            <Switch
              value={locationServices}
              onValueChange={setLocationServices}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={locationServices ? '#22668D' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="cloud-upload-outline" size={22} color="#666" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>Auto-save Posts</Text>
                <Text style={styles.settingDescription}>Save drafts automatically</Text>
              </View>
            </View>
            <Switch
              value={autoSave}
              onValueChange={setAutoSave}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={autoSave ? '#22668D' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="lock-closed-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Privacy & Security</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="language-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Language</Text>
            <Text style={styles.menuValue}>English</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleReset}>
            <Ionicons name="refresh-outline" size={22} color="#666" />
            <Text style={styles.menuText}>Reset Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>TravelShare v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFADD',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22668D',
    marginBottom: 16,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderPic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#22668D',
    padding: 6,
    borderRadius: 15,
  },
  profileHint: {
    fontSize: 12,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  menuValue: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#22668D',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    backgroundColor: 'transparent',
  },
  logoutButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
});

export default Settings;