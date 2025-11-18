// AddPost.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { PostContext } from '../Context/PostContext';

const AddPost = ({ navigation }) => {
  const { addPost } = useContext(PostContext);

  const [place, setPlace] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [image, setImage] = useState(null);

  // Open camera or gallery
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to your photos.');
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

  const handlePost = () => {
    if (!place || !location || !rating || !comment) {
      Alert.alert('Missing info', 'Please fill in all fields before posting.');
      return;
    }

    addPost({
      place,
      location,
      rating: Number(rating),
      comment,
      image,
    });

    navigation.goBack();
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

      {/* Image Picker */}
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>
          {image ? 'Change Image' : 'Add Image'}
        </Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={styles.previewImage} />
      )}

      <TouchableOpacity style={styles.postButton} onPress={handlePost}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFADD',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  imageButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  postButton: {
    backgroundColor: '#00A36C',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
