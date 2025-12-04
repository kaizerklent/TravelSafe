// EditPostScreen.js
import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

import CustomHeader from "../components/CustomHeader";
import Input from "../components/Input";

const EditPostScreen = ({ route, navigation }) => {
  const { post } = route.params;

  const [place, setPlace] = useState(post.place);
  const [location, setLocation] = useState(post.location);
  const [rating, setRating] = useState(String(post.rating));
  const [comment, setComment] = useState(post.comment);
  const [image, setImage] = useState(post.image);

  // Pick image
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow photo access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images ?? ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Save updated post
  const handleSave = async () => {
    if (!place || !location || !rating || !comment) {
      Alert.alert("Missing Details", "Please fill out all fields.");
      return;
    }

    try {
      await updateDoc(doc(db, "posts", post.id), {
        place,
        location,
        rating: Number(rating),
        comment,
        image,
      });

      Alert.alert("Success", "Post updated!");
      navigation.goBack();
    } catch (error) {
      console.log("Edit Error:", error);
      Alert.alert("Error", "Could not update post.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <CustomHeader
        title="Edit Post"
        onMenuPress={() => navigation.toggleDrawer()}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Image */}
        <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
          <Image source={{ uri: image }} style={styles.image} />
          <Text style={styles.changeImageText}>Change Image</Text>
        </TouchableOpacity>

        {/* Inputs */}
        <Input placeholder="Place" value={place} onChangeText={setPlace} />
        <Input placeholder="Location" value={location} onChangeText={setLocation} />
        <Input
          placeholder="Rating (1–5)"
          value={rating}
          onChangeText={setRating}
          keyboardType="numeric"
        />
        <Input placeholder="Comment" value={comment} onChangeText={setComment} />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFADD",
  },
  scrollContainer: {
    padding: 20,
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
  },
  changeImageText: {
    marginTop: 8,
    color: "#22668D",
    fontWeight: "600",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#22668D",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
