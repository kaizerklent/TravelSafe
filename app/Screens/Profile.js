// Profile.js
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader';

const Profile = ({ navigation }) => {
  return (
    
    <View style={styles.container}>
      {/* Custom Header */}
      <CustomHeader
        title="Profile"
        onMenuPress={() => navigation.toggleDrawer()}
        rightComponent={
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="settings-outline" size={22} color="#333" />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Cover Photo */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' }}
            style={styles.coverPhoto}
          />
          {/* Edit Cover Button */}
          <TouchableOpacity style={styles.editCoverButton}>
            <Ionicons name="camera" size={16} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Profile Picture */}
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=8' }}
              style={styles.profilePic}
            />
            {/* Edit Profile Picture Button */}
            <TouchableOpacity style={styles.editProfileButton}>
              <Ionicons name="camera" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.username}>@johndoe</Text>
          <Text style={styles.bio}>
            Passionate IT student who loves exploring software development and building cool projects.
          </Text>

          {/* Edit Profile Button */}
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>1.2K</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>356</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Places</Text>
          </View>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activityItem}>
            <Ionicons name="heart" size={20} color="#FF6B6B" />
            <Text style={styles.activityText}>Liked Chocolate Hills post</Text>
            <Text style={styles.activityTime}>2h ago</Text>
          </View>

          <View style={styles.activityItem}>
            <Ionicons name="chatbubble" size={20} color="#22668D" />
            <Text style={styles.activityText}>Commented on Baguio City</Text>
            <Text style={styles.activityTime}>1d ago</Text>
          </View>

          <View style={styles.activityItem}>
            <Ionicons name="location" size={20} color="#00A36C" />
            <Text style={styles.activityText}>Added new post: Manila Bay</Text>
            <Text style={styles.activityTime}>2d ago</Text>
          </View>
        </View>

        {/* Badges Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Badges</Text>
          </View>
          <View style={styles.badgesContainer}>
            <View style={styles.badge}>
              <Ionicons name="trophy" size={24} color="#FFD700" />
              <Text style={styles.badgeText}>Explorer</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="camera" size={24} color="#22668D" />
              <Text style={styles.badgeText}>Photographer</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="heart" size={24} color="#FF6B6B" />
              <Text style={styles.badgeText}>Social</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFADD',
  },
  scrollContainer: {
    flex: 1,
  },
  headerButton: {
    padding: 4,
  },
  coverContainer: {
    width: '100%',
    height: 150,
    position: 'relative',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  editCoverButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFADD',
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#22668D',
    padding: 6,
    borderRadius: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  username: {
    color: '#666',
    fontSize: 16,
    marginBottom: 8,
  },
  bio: {
    textAlign: 'center',
    color: '#444',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#22668D',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#22668D',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#22668D',
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#888',
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  badge: {
    alignItems: 'center',
    padding: 10,
  },
  badgeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});

export default Profile;