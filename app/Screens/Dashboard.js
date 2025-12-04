// Dashboard.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { db, auth } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import CustomHeader from "../components/CustomHeader";
import { PostContext } from "../Context/PostContext";

const Dashboard = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [visibleImage, setVisibleImage] = useState(null);

  // ⭐ Keep all context actions
  const { toggleFavorite, toggleLike, deletePost } = useContext(PostContext);

  // ⭐ LIVE Firestore fetch
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(list);
    });

    return unsubscribe;
  }, []);

  // ⭐ Convert Firestore timestamp to "2h ago"
  const timeAgo = (timestamp) => {
    if (!timestamp) return "Just now";
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

    for (const [unit, value] of Object.entries(intervals)) {
      const count = Math.floor(seconds / value);
      if (count > 0) return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }

    return "Just now";
  };

  // ⭐ Share a post
  const handleShare = async (item) => {
    try {
      await Share.share({
        message: `Check out ${item.place} in ${item.location}! ⭐${item.rating}/5\n"${item.comment}"`,
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  // ⭐ Header Add Button
  const HeaderRight = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate("AddPost")}
      style={styles.headerButton}
    >
      <Ionicons name="add" size={24} color="#22668D" />
    </TouchableOpacity>
  );

  // ⭐ RENDER POST CARD
  const renderPost = ({ item }) => {
    const isOwner = auth?.currentUser?.uid === item.userId;

    const imageSource =
      item.image && typeof item.image === "string"
        ? { uri: item.image }
        : item.image;

    return (
      <View style={styles.postCard}>
        {/* 🔹 USER HEADER */}
        <View style={styles.userHeader}>
          <Image
            source={
              item.profilePic
                ? { uri: item.profilePic }
                : { uri: "https://i.pravatar.cc/150?img=1" } // fallback
            }
            style={styles.userPic}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.usernameText}>{item.username}</Text>
            <Text style={styles.timeText}>{timeAgo(item.createdAt)}</Text>
          </View>

          {/* 🔹 EDIT + DELETE BUTTONS FOR OWNER */}
          {isOwner && (
            <View style={styles.ownerActions}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("EditPost", { post: item })
                }
              >
                <Ionicons name="create-outline" size={20} color="#22668D" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deletePost(item.id)}>
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="red"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 🔹 POST IMAGE */}
        <TouchableOpacity onPress={() => setVisibleImage(imageSource)}>
          {imageSource && <Image source={imageSource} style={styles.postImage} />}
        </TouchableOpacity>

        {/* 🔹 POST CONTENT */}
        <Text style={styles.postPlace}>{item.place}</Text>
        <Text style={styles.postLocation}>📍 {item.location}</Text>
        <Text style={styles.postRating}>⭐ {item.rating}/5</Text>
        <Text style={styles.postComment}>{item.comment}</Text>

        {/* 🔹 LIKE / FAVORITE / COMMENT / SHARE */}
        <View style={styles.actionRow}>
        {/* LIKE */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => toggleLike(item.id)}
        >
          <Ionicons
            name={item.liked ? "thumbs-up" : "thumbs-up-outline"}
            size={20}
            color={item.liked ? "#22668D" : "#555"}
          />
          <Text style={styles.actionText}>{item.likes} Likes</Text>
        </TouchableOpacity>

        {/* FAVORITE */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons
            name={item.favorite ? "heart" : "heart-outline"}
            size={20}
            color={item.favorite ? "red" : "#555"}
          />
          <Text style={styles.actionText}>{item.favorites || 0} Favorites</Text>
        </TouchableOpacity>

        {/* COMMENTS */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("PostDetail", { postId: item.id })}
        >
          <Ionicons name="chatbubble-outline" size={20} color="#555" />
          <Text style={styles.actionText}>
            {item.commentsCount || 0} Comments
          </Text>
        </TouchableOpacity>
      </View>

            </View>
          );
        };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <CustomHeader
          title="Dashboard"
          onMenuPress={() => navigation.toggleDrawer()}
          rightComponent={<HeaderRight />}
        />

        {/* LIST OF POSTS */}
        <View style={styles.content}>
          {posts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="images-outline" size={60} color="#CCC" />
              <Text style={styles.emptyText}>No posts yet.</Text>
              <Text style={styles.emptySubText}>
                Be the first to share a place!
              </Text>
            </View>
          ) : (
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id}
              renderItem={renderPost}
              contentContainerStyle={styles.postList}
            />
          )}
        </View>

        {/* 🔍 IMAGE ZOOM MODAL */}
        <Modal
          visible={!!visibleImage}
          transparent
          animationType="fade"
          onRequestClose={() => setVisibleImage(null)}
        >
          <View style={styles.modalContainer}>
            <Pressable
              style={styles.modalClose}
              onPress={() => setVisibleImage(null)}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </Pressable>

            {visibleImage && (
              <Image
                source={visibleImage}
                style={styles.fullImage}
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFADD",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFADD",
  },
  content: {
    flex: 1,
  },
  headerButton: {
    padding: 4,
  },
  postList: {
    padding: 16,
    paddingTop: 10,
    paddingBottom: 30,
  },

  /* EMPTY STATE */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  emptySubText: {
    color: "#888",
    fontSize: 14,
    marginTop: 5,
  },

  /* POST CARD */
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
  },

  /* USER HEADER */
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userPic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  usernameText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 12,
    color: "#666",
  },
  ownerActions: {
    flexDirection: "row",
    alignItems: "center",
  },

  /* IMAGE */
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },

  /* POST DETAILS */
  postPlace: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
    color: "#333",
  },
  postLocation: {
    color: "#666",
    marginTop: 2,
  },
  postRating: {
    marginTop: 2,
    color: "#FFA500",
  },
  postComment: {
    marginTop: 6,
    lineHeight: 18,
    color: "#555",
  },

  /* ACTIONS */
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 6,
    color: "#555",
  },

  /* IMAGE MODAL */
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalClose: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 50,
    padding: 8,
  },
  fullImage: {
    width: "95%",
    height: "80%",
  },
});

export default Dashboard;
