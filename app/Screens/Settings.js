// Settings.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../components/CustomHeader";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Settings = ({ navigation }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  // Load user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userRef = doc(db, "users", uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();
          setUsername(data.username || "");
          setFullName(data.fullName || "");
          setEmail(data.email || "");
          setBio(data.bio || "");
          setProfilePic(data.profilePic || null);
          setCoverPhoto(data.coverPhoto || null);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserData();
  }, []);

  // Pick profile photo
  const pickProfile = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return Alert.alert("Permission needed");

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) setProfilePic(result.assets[0].uri);
};

const pickCover = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return Alert.alert("Permission needed");

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [3, 1],
    quality: 0.8,
  });

  if (!result.canceled) setCoverPhoto(result.assets[0].uri);
};


  // Save to Firestore (local file paths only)
  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        username,
        fullName,
        bio,
        profilePic,  // file:// path
        coverPhoto,  // file:// path
      });
      Alert.alert("Saved", "Profile updated!");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to save profile.");
    }
  };

  // Logout
  const handleLogout = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Settings" onMenuPress={() => navigation.toggleDrawer()} />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* 🔵 Cover Photo Section */}
        <View style={styles.coverContainer}>
          <Image
            source={{
              uri:
                coverPhoto ||
                "https://via.placeholder.com/800x300/cccccc/000000?text=Cover",
            }}
            style={styles.coverPhoto}
          />

          {/* Edit Cover Button */}
          <TouchableOpacity style={styles.editCoverButton} onPress={pickCover}>
            <Ionicons name="camera" size={18} color="#333" />
          </TouchableOpacity>
        </View>

        {/* 🟣 Profile Section */}
        <View style={styles.profileContainer}>
          <View style={styles.profileWrapper}>
            <Image
              source={{
                uri:
                  profilePic ||
                  "https://via.placeholder.com/150/cccccc/000000?text=Profile",
              }}
              style={styles.profilePic}
            />

            <TouchableOpacity style={styles.editProfileButton} onPress={pickProfile}>
              <Ionicons name="camera" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 🟡 Form Section */}
        <View style={styles.formSection}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            editable={false}
          />

          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Bio"
            multiline
            value={bio}
            onChangeText={setBio}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFADD" },
  scrollContainer: { flex: 1 },

  // COVER PHOTO
  coverContainer: {
    width: "100%",
    height: 150,
    backgroundColor: "#ddd",
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
  },
  editCoverButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },

  // PROFILE PIC
  profileContainer: {
    alignItems: "center",
    marginTop: -50,
  },
  profileWrapper: {
    position: "relative",
  },
  profilePic: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#FFFADD",
  },
  editProfileButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#22668D",
    padding: 6,
    borderRadius: 20,
  },

  // FORM
  formSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },

  // BUTTONS
  saveButton: {
    backgroundColor: "#22668D",
    marginTop: 15,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  saveText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF6B6B",
    marginHorizontal: 20,
  },
  logoutText: {
    color: "#FF6B6B",
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default Settings;
