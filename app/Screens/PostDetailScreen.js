// PostDetailScreen.js
import React, { useContext, useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PostContext } from '../Context/PostContext';

export default function PostDetailScreen({ route }) {
  const { postId } = route.params;
  const { posts, toggleFavorite, toggleLike, addComment } = useContext(PostContext);

  const post = posts.find((p) => p.id === postId);
  const [commentText, setCommentText] = useState('');
  const [zoomVisible, setZoomVisible] = useState(false);

  if (!post) return <Text>Post not found</Text>;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${post.place} - ${post.location}\n${post.comment}`,
      });
    } catch (e) {
      console.error('Error sharing:', e);
    }
  };

  const handleAddComment = () => {
    addComment(post.id, commentText);
    setCommentText('');
  };

  const imageSource =
    typeof post.image === 'number' ? post.image : { uri: post.image };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setZoomVisible(true)}>
        <Image source={imageSource} style={styles.image} />
      </TouchableOpacity>

      {/* Zoom Modal */}
      <Modal visible={zoomVisible} transparent>
        <Pressable style={styles.modalBackground} onPress={() => setZoomVisible(false)}>
          <Image source={imageSource} style={styles.zoomedImage} resizeMode="contain" />
        </Pressable>
      </Modal>

      <View style={styles.details}>
        <Text style={styles.place}>{post.place}</Text>
        <Text style={styles.location}>📍 {post.location}</Text>
        <Text style={styles.comment}>{post.comment}</Text>
        <Text style={styles.rating}>⭐ {post.rating}/5</Text>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => toggleLike(post.id)} style={styles.actionButton}>
            <Ionicons
              name={post.liked ? 'thumbs-up' : 'thumbs-up-outline'}
              size={26}
              color={post.liked ? '#22668D' : '#333'}
            />
            <Text>{post.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => toggleFavorite(post.id)} style={styles.actionButton}>
            <Ionicons
              name={post.favorite ? 'heart' : 'heart-outline'}
              size={26}
              color={post.favorite ? 'red' : '#333'}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={26} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <View style={styles.commentSection}>
          <Text style={styles.commentTitle}>Comments</Text>

          <FlatList
            data={post.comments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text style={styles.commentItem}>• {item}</Text>}
            ListEmptyComponent={<Text style={styles.noComments}>No comments yet.</Text>}
          />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFADD' },
  image: { width: '100%', height: 250 },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomedImage: { width: '90%', height: '90%' },
  details: { padding: 15 },
  place: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  location: { color: '#666', marginTop: 4 },
  comment: { marginVertical: 10, fontSize: 16, color: '#444' },
  rating: { color: '#FFA500', fontSize: 16 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  actionButton: { alignItems: 'center' },
  commentSection: { marginTop: 10 },
  commentTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  commentItem: { backgroundColor: '#fff', padding: 8, borderRadius: 8, marginBottom: 6 },
  noComments: { color: '#777', fontStyle: 'italic' },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  commentInput: { flex: 1, paddingVertical: 8 },
});
