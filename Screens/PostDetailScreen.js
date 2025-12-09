// PostDetailScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  TextInput,
  FlatList,
  Modal,
  Pressable,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";

export default function PostDetailScreen({ route }) {
  const { postId } = route.params;

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [zoomVisible, setZoomVisible] = useState(false);

  // Load post data
  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "posts", postId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setPost({ id: snap.id, ...snap.data() });
      }
    };

    fetchPost();
  }, [ postId ]);

  // Load comments (real-time)
  useEffect(() => {
    const commentsRef = collection(db, "posts", postId, "comments");

    const unsub = onSnapshot(commentsRef, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(list);
    });

    return unsub;
  }, [ postId ]);

  // Load user profile for comments
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (snap.exists()) setUserProfile(snap.data());
    };
    fetchProfile();
  }, []);

  if (!post) return <Text>Loading...</Text>;

  const timeAgo = (timestamp) => {
    if (!timestamp) return "";

    const date = timestamp.toDate();
    const seconds = Math.floor((new Date() - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (let [unit, value] of Object.entries(intervals)) {
      const count = Math.floor(seconds / value);
      if (count > 0) return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }

    return "Just now";
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${post.place} - ${post.location}\n${post.comment}`,
      });
    } catch (e) {
      console.log("Sharing error:", e);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        userId: auth.currentUser.uid,
        username: userProfile?.username || "Unknown",
        profilePic: userProfile?.profilePic || null,
        commentText,
        createdAt: serverTimestamp(),
      });

      setCommentText("");
    } catch (error) {
      Alert.alert("Error adding comment");
      console.log(error);
    }
  };

  const imageSource =
    typeof post.image === "string" ? { uri: post.image } : post.image;

  return (
    <View style={styles.container}>
      {/* IMAGE */}
      <TouchableOpacity onPress={() => setZoomVisible(true)}>
        <Image source={imageSource} style={styles.image} />
      </TouchableOpacity>

      {/* ZOOM MODAL */}
      <Modal visible={zoomVisible} transparent>
        <Pressable
          style={styles.modalBackground}
          onPress={() => setZoomVisible(false)}
        >
          <Image source={imageSource} style={styles.zoomedImage} />
        </Pressable>
      </Modal>

      <View style={styles.details}>
        {/* POST DETAILS */}
        <Text style={styles.place}>{post.place}</Text>
        <Text style={styles.location}>📍 {post.location}</Text>
        <Text style={styles.comment}>{post.comment}</Text>
        <Text style={styles.rating}>⭐ {post.rating}/5</Text>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="thumbs-up-outline" size={26} color="#333" />
            <Text>{post.likes || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={26} color="#333" />
            <Text>{post.favorites || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={26} color="#333" />
          </TouchableOpacity>
        </View>

        {/* COMMENTS */}
        <Text style={styles.commentTitle}>Comments</Text>

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentRow}>
              <Image
                source={
                  item.profilePic
                    ? { uri: item.profilePic }
                    : { uri: "https://i.pravatar.cc/150?img=4" }
                }
                style={styles.commentPic}
              />

              <View style={styles.commentBubble}>
                <Text style={styles.commentUsername}>{item.username}</Text>
                <Text style={styles.commentText}>{item.commentText}</Text>
                <Text style={styles.commentTime}>{timeAgo(item.createdAt)}</Text>
              </View>
            </View>
          )}
        />

        {/* COMMENT INPUT */}
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity onPress={handleAddComment}>
            <Ionicons name="send" size={24} color="#22668D" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFADD' 
  },
  image: { 
    width: '100%', 
    height: 250 
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomedImage: { 
    width: '90%', 
    height: '90%' 
  },
  details: { 
    padding: 15 
  },
  place: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  location: { 
    color: '#666', 
    marginTop: 4 
  },
  comment: { 
    marginVertical: 10, 
    fontSize: 16, 
    color: '#444' 
  },
  rating: { 
    color: '#FFA500', 
    fontSize: 16 
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  actionButton: { 
    alignItems: 'center' 
  },
  commentSection: { 
    marginTop: 10 
  },
  commentTitle: { 
    fontWeight: 'bold', 
    fontSize: 18, 
    marginBottom: 8 
  },
  commentItem: { 
      backgroundColor: '#fff', 
      padding: 8, 
      borderRadius: 8, 
      marginBottom: 6 
    },
  noComments: { 
      color: '#777', 
      fontStyle: 'italic' 
    },
    commentInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      backgroundColor: '#fff',
      borderRadius: 8,
      paddingHorizontal: 10,
    },
  commentInput: { 
      flex: 1, 
      paddingVertical: 8 
    },
  commentRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },

  commentPic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#ddd",
  },

  commentBubble: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    flex: 1,
  },

  commentUsername: {
    fontWeight: "bold",
    color: "#333",
  },

  commentText: {
    color: "#444",
    marginVertical: 4,
  },

  commentTime: {
    fontSize: 12,
    color: "#888",
  },

});
