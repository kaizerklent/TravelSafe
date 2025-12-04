import React, { createContext, useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db, auth } from "../firebase";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  // 🔥 LOAD POSTS REAL-TIME
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedPosts = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setPosts(loadedPosts);
    });

    return unsubscribe;
  }, []);

  // 🔥 ADD POST
  const addPost = async ({ place, location, rating, comment, image }) => {
    try {
      await addDoc(collection(db, "posts"), {
        place,
        location,
        rating,
        comment,
        image,
        liked: false,
        favorite: false,
        likes: 0,
        comments: [],
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.log("Post Error:", err);
    }
  };

  // 🔥 LIKE
  const handleToggleLike = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    try {
      await updateDoc(doc(db, "posts", postId), {
        liked: !post.liked,
        likes: post.liked ? post.likes - 1 : post.likes + 1,
      });
    } catch (err) {
      console.log("Like Error:", err);
    }
  };

  // 🔥 FAVORITE
  const handleToggleFavorite = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    try {
      await updateDoc(doc(db, "posts", postId), {
        favorite: !post.favorite,
      });
    } catch (err) {
      console.log("Favorite Error:", err);
    }
  };

  // 🔥 ADD COMMENT
  const addComment = async (postId, newComment) => {
    const post = posts.find((p) => p.id === postId);
    if (!post || !newComment.trim()) return;

    try {
      await updateDoc(doc(db, "posts", postId), {
        comments: [...(post.comments || []), newComment],
      });
    } catch (err) {
      console.log("Comment Error:", err);
    }
  };

  // 🔥 DELETE POST
  const deletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      console.log("Deleted post:", postId);
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  // 🔥 EDIT POST
  const editPost = async (postId, updatedData) => {
    try {
      await updateDoc(doc(db, "posts", postId), updatedData);
    } catch (err) {
      console.log("Edit Error:", err);
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        addPost,
        toggleLike: handleToggleLike,
        toggleFavorite: handleToggleFavorite,
        addComment,
        deletePost,
        editPost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export default PostProvider;
