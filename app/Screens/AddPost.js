// AddPost.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

const AddPost = ({ navigation }) => {
  const [place, setPlace] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);

  const [userProfile, setUserProfile] = useState(null);

  // ✅ Load user info (username + profilePic)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (snap.exists()) {
          setUserProfile(snap.data());
        }
      } catch (e) {
        console.log("User fetch error:", e);
      }
    };

    fetchUserProfile();
  }, []);

  // ✅ Pick image (expo-image-picker v17+)
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow photo access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // ✅ Save Post to Firestore
  const handlePost = async () => {
    if (!place || !location || !rating || !comment) {
      return Alert.alert("Missing info", "Please fill all fields.");
    }

    if (!auth.currentUser) {
      return Alert.alert("Error", "You must be logged in.");
    }

    try {
      await addDoc(collection(db, "posts"), {
        userId: auth.currentUser.uid,

        // user identity
        username: userProfile?.username || "Unknown",
        profilePic: userProfile?.profilePic || null,

        // post content
        place,
        location,
        rating: Number(rating),
        comment,
        image, // local URI

        // initial values
        likes: 0,
        favorites: 0,

        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Post created!");
      navigation.goBack();
    } catch (error) {
      console.log("Post Error:", error);
      Alert.alert("Error", "Could not create post.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Place</Text>

      <TextInput
        style={styles.input}
        placeholder="Place name"
        value={place}
        onChangeText={setPlace}
      />

      <TextInput
        style={styles.input}
        placeholder="Location (e.g. Bohol, Philippines)"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Rating (1–5)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Write your comment..."
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>
          {image ? "Change Image" : "Add Image"}
        </Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.previewImage} />}

      <TouchableOpacity style={styles.postButton} onPress={handlePost}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddPost;

// ---------- STYLES ----------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFADD",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  imageButton: {
    backgroundColor: "#4682B4",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  postButton: {
    backgroundColor: "#00A36C",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
