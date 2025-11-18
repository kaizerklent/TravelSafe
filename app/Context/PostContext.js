import React, { createContext, useState } from 'react';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([
    {
      id: '1',
      place: 'Chocolate Hills',
      location: 'Bohol, Philippines',
      rating: 5,
      comment: 'Absolutely stunning!',
      image: require('../assets/images/buhol.jpg'),
      favorite: false,
      liked: false,
      likes: 0,
      comments: [],
    },
    {
      id: '2',
      place: 'Baguio City',
      location: 'Benguet, Philippines',
      rating: 4,
      comment: 'Cool weather and great food!',
      image: require('../assets/images/baguio.webp'),
      favorite: false,
      liked: false,
      likes: 0,
      comments: [],
    },
  ]);

  const addPost = (postData) => {
    const newPost = {
      id: Date.now().toString(),
      place: postData.place,
      location: postData.location,
      rating: postData.rating,
      comment: postData.comment,
      image: postData.image,
      favorite: false,
      liked: false,
      likes: 0,
      comments: []
    };
    
    setPosts(prev => [newPost, ...prev]);
  };

  const toggleFavorite = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, favorite: !p.favorite } : p
      )
    );
  };

  const toggleLike = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likes: p.likes + (p.liked ? -1 : 1), liked: !p.liked }
          : p
      )
    );
  };

  const addComment = (postId, comment) => {
    if (!comment.trim()) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: [...p.comments, comment] }
          : p
      )
    );
  };

  return (
    <PostContext.Provider
      value={{ posts, addPost, toggleFavorite, toggleLike, addComment }}
    >
      {children}
    </PostContext.Provider>
  );
};

// Default export for module resolution
export default PostProvider;