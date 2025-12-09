//AddPost.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const handlePost = async () => {
    if (!place || !location || !rating || !comment) {
      return Alert.alert("Missing info", "Please fill all fields.");
    }

    try {
      await addDoc(collection(db, "posts"), {
        userId: auth.currentUser.uid,
        username: userProfile?.username || "Unknown",
        profilePic: userProfile?.profilePic || null,

        place,
        location,
        rating: Number(rating),
        comment,
        image,

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
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={styles.title}>Add a New Place</Text>

        <TextInput
          style={styles.input}
          placeholder="Place name"
          placeholderTextColor="#888"
          value={place}
          onChangeText={setPlace}
        />

        <TextInput
          style={styles.input}
          placeholder="Location (e.g. Bohol, Philippines)"
          placeholderTextColor="#888"
          value={location}
          onChangeText={setLocation}
        />

        <TextInput
          style={styles.input}
          placeholder="Rating (1–5)"
          placeholderTextColor="#888"
          value={rating}
          onChangeText={setRating}
          keyboardType="numeric"
        />

        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Write your comment..."
          placeholderTextColor="#888"
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

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFADD" },
  container: { padding: 20, paddingBottom: 40 },
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
    color: "black",
  },
  imageButton: {
    backgroundColor: "#4682B4",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  imageButtonText: { color: "#fff", fontWeight: "bold" },
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
  postButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default AddPost;
