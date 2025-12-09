// Profile.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../components/CustomHeader";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userRef = doc(db, "users", uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          setUserData(snap.data());
        }
      } catch (err) {
        console.log("Profile Load Error:", err);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  if (loading || !userData) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#22668D" />
      </View>
    );
  }

  const coverPhotoURI =
    userData.coverPhoto ||
    "https://via.placeholder.com/800x300/cccccc/000000?text=No+Cover+Photo";

  const profilePicURI =
    userData.profilePic ||
    "https://via.placeholder.com/150/cccccc/000000?text=No+Profile";

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title="Profile"
        onMenuPress={() => navigation.toggleDrawer()}
        rightComponent={
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("Settings")}
          >
            <Ionicons name="settings-outline" size={22} color="#333" />
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Cover Photo */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: coverPhotoURI }}
            style={styles.coverPhoto}
          />
        </View>

        {/* Profile Picture */}
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: profilePicURI }}
              style={styles.profilePic}
            />
          </View>

          <Text style={styles.name}>{userData.fullName}</Text>
          <Text style={styles.username}>@{userData.username}</Text>

          <Text style={styles.bio}>
            {userData.bio ? userData.bio : "No bio yet."}
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Places</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>

          <Text style={{ color: "#666", textAlign: "center" }}>
            No recent activity.
          </Text>
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
    </SafeAreaView>
  );
};

// ---------------- STYLES ----------------
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
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
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
    marginTop: 10,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 12,
  },
  statBox: { alignItems: 'center' },
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
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  badge: { alignItems: 'center', padding: 10 },
  badgeText: { fontSize: 12, color: '#666', marginTop: 5 },
});

export default Profile;
