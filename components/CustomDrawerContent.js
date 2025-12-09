// CustomDrawerContent.js
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function CustomDrawerContent(props) {
  const [userData, setUserData] = useState(null);

  // Fetch user data on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userRef = doc(db, "users", uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) setUserData(snap.data());
      } catch (error) {
        console.log("Drawer Load Error:", error);
      }
    };

    loadUser();
  }, []);

  const profilePic =
    userData?.profilePic ||
    "https://via.placeholder.com/150/cccccc/000000?text=Profile";

  const coverPhoto =
    userData?.coverPhoto ||
    "https://via.placeholder.com/300x120/cccccc/000000?text=Cover";

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      
      {/* COVER PHOTO */}
      <View style={styles.coverContainer}>
        <Image source={{ uri: coverPhoto }} style={styles.coverPhoto} />
      </View>

      {/* PROFILE HEADER */}
      <View style={styles.header}>
        <Image source={{ uri: profilePic }} style={styles.profilePic} />

        <Text style={styles.username}>
          {userData?.username || "User"}
        </Text>

        <Text style={styles.email}>
          {userData?.email || ""}
        </Text>
      </View>

      {/* NAV ITEMS */}
      <DrawerItemList {...props} />

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>v1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  coverContainer: {
    width: "100%",
    height: 120,
    backgroundColor: "#ddd",
  },
  coverPhoto: {
    width: "100%",
    height: "100%",
  },
  header: {
    padding: 15,
    alignItems: "center",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  profilePic: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#fff",
    marginTop: -35, // Overlaps cover photo beautifully
    backgroundColor: "#eee",
  },
  username: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 13,
    color: "#666",
    marginTop: 3,
  },
  footer: {
    marginTop: "auto",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});
