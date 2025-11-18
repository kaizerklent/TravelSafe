// Dashboard.js
import React, { useContext, useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PostContext } from '../Context/PostContext';
import CustomHeader from '../components/CustomHeader';

const Dashboard = ({ navigation }) => {
  const { posts, toggleFavorite, toggleLike } = useContext(PostContext);
  const [visibleImage, setVisibleImage] = useState(null);

  const handleShare = async (item) => {
    try {
      await Share.share({
        message: `Check out ${item.place} in ${item.location}! ⭐${item.rating}/5\n"${item.comment}"`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  // Add Post button component for header
  const HeaderRight = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AddPost')}
      style={styles.headerButton}
    >
      <Ionicons name="add" size={24} color="#22668D" />
    </TouchableOpacity>
  );

  const renderPost = ({ item }) => {
    const imageSource = typeof item.image === 'number' ? item.image : { uri: item.image };

    return (
      <View style={styles.postCard}>
        {/* Image with proper touch area */}
        <TouchableOpacity 
          onPress={() => setVisibleImage(imageSource)} 
          style={styles.imageContainer}
        >
          {item.image && <Image source={imageSource} style={styles.postImage} />}

          <View style={styles.imageOverlay}>
            <Ionicons name="expand" size={24} color="white" />
          </View>
        </TouchableOpacity>

        <View style={styles.postHeader}>
          <Text style={styles.postPlace}>{item.place}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
            <Ionicons
              name={item.favorite ? 'heart' : 'heart-outline'}
              size={26}
              color={item.favorite ? 'red' : '#888'}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.postLocation}>📍 {item.location}</Text>
        <Text style={styles.postRating}>⭐ {item.rating}/5</Text>
        <Text style={styles.postComment}>{item.comment}</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.iconButton}>
            <Ionicons
              name={item.liked ? 'thumbs-up' : 'thumbs-up-outline'}
              size={22}
              color={item.liked ? '#22668D' : '#555'}
            />
            <Text style={styles.actionText}>
              {item.likes || 0} Like{item.likes !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
            style={styles.iconButton}
          >
            <Ionicons name="chatbubble-outline" size={22} color="#555" />
            <Text style={styles.actionText}>
              {item.comments?.length || 0} Comment{item.comments?.length !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleShare(item)} style={styles.iconButton}>
            <Ionicons name="share-social-outline" size={22} color="#555" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Custom Header */}
        <CustomHeader
          title="Dashboard"
          onMenuPress={() => navigation.toggleDrawer()}
          rightComponent={<HeaderRight />}
        />

        {/* Main Content with proper spacing */}
        <View style={styles.content}>
          {posts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="images-outline" size={60} color="#CCC" />
              <Text style={styles.emptyText}>No posts yet.</Text>
              <Text style={styles.emptySubText}>Be the first to share a place!</Text>
              <TouchableOpacity 
                style={styles.addFirstPostButton}
                onPress={() => navigation.navigate('AddPost')}
              >
                <Text style={styles.addFirstPostText}>Add Your First Post</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id}
              renderItem={renderPost}
              contentContainerStyle={styles.postList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Image Zoom Modal */}
        <Modal 
          visible={!!visibleImage} 
          transparent={true} 
          onRequestClose={() => setVisibleImage(null)}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <Pressable style={styles.modalClose} onPress={() => setVisibleImage(null)}>
              <Ionicons name="close" size={28} color="#fff" />
            </Pressable>
            {visibleImage && (
              <Image source={visibleImage} style={styles.fullImage} resizeMode="contain" />
            )}
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFADD',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFADD',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 5,
    fontSize: 14,
    marginBottom: 20,
  },
  addFirstPostButton: {
    backgroundColor: '#22668D',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addFirstPostText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  imageOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 6,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  postPlace: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  postLocation: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  postRating: {
    fontSize: 14,
    color: '#FFA500',
    marginTop: 4,
  },
  postComment: {
    fontSize: 14,
    color: '#555',
    marginTop: 6,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  actionText: {
    marginLeft: 5,
    color: '#555',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '95%',
    height: '80%',
  },
  modalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
});

export default Dashboard;