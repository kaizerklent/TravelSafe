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
  arrayUnion,
  arrayRemove,
  increment
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

  // 🔥 ADD POST — fully allowed by rules
  const addPost = async ({ place, location, rating, comment, image }) => {
    try {
      await addDoc(collection(db, "posts"), {
        place,
        location,
        rating,
        comment,
        image,
        likes: 0,
        favorites: 0,
        comments: [],
        likedBy: [],
        favoritedBy: [],
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.log("Post Error:", err);
    }
  };

  // 🔥 LIKE — only updates allowed fields (likes, likedBy)
  const handleToggleLike = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const uid = auth.currentUser.uid;
    const alreadyLiked = post.likedBy?.includes(uid);

    try {
      await updateDoc(doc(db, "posts", postId), {
        likes: increment(alreadyLiked ? -1 : 1),
        likedBy: alreadyLiked
          ? arrayRemove(uid)
          : arrayUnion(uid)
      });
    } catch (err) {
      console.log("Like Error:", err);
    }
  };

  // 🔥 FAVORITE — only updates favorites + favoritedBy (allowed)
  const handleToggleFavorite = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const uid = auth.currentUser.uid;
    const alreadyFav = post.favoritedBy?.includes(uid);

    try {
      await updateDoc(doc(db, "posts", postId), {
        favorites: increment(alreadyFav ? -1 : 1),
        favoritedBy: alreadyFav
          ? arrayRemove(uid)
          : arrayUnion(uid)
      });
    } catch (err) {
      console.log("Favorite Error:", err);
    }
  };

  // 🔥 ADD COMMENT — fully allowed by rules
  const addComment = async (postId, newComment) => {
    if (!newComment.trim()) return;

    try {
      await updateDoc(doc(db, "posts", postId), {
        comments: arrayUnion({
          text: newComment,
          userId: auth.currentUser.uid,
          createdAt: Date.now()
        })
      });
    } catch (err) {
      console.log("Comment Error:", err);
    }
  };

  // 🔥 DELETE POST — only allowed for owner (your rules)
  const deletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      console.log("Deleted post:", postId);
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  // 🔥 EDIT POST — ONLY ALLOWED FOR OWNER
  // We must update ONLY fields allowed for the owner
  const editPost = async (postId, updatedData) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    if (post.userId !== auth.currentUser.uid) {
      console.log("Edit Error: Permission denied – only owner can edit.");
      return;
    }

    try {
      // Owner can update any of these fields safely:
      const safeData = {
        place: updatedData.place,
        location: updatedData.location,
        rating: updatedData.rating,
        comment: updatedData.comment,
        image: updatedData.image
      };

      await updateDoc(doc(db, "posts", postId), safeData);

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
