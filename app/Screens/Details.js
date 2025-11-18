// Details.js
import React from 'react';
import { View, Image, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../components/CustomHeader';
import CustomButton from '../components/Button';

const Details = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <CustomHeader
        title="About App"
        onMenuPress={() => navigation.toggleDrawer()}
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Icon */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
            }}
            style={styles.image}
          />
        </View>

        <Text style={styles.title}>Welcome to TravelShare</Text>
        <Text style={styles.subtitle}>Your Travel Companion</Text>

        <Text style={styles.description}>
          TravelShare is designed to make your travel experiences more memorable and social. 
          Share your favorite destinations, discover new places through friends, and create 
          lasting memories of your adventures.
        </Text>

        {/* Features Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>✨ Key Features</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📸</Text>
            <Text style={styles.featureText}>Share travel photos and experiences</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⭐</Text>
            <Text style={styles.featureText}>Rate and review locations</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💬</Text>
            <Text style={styles.featureText}>Connect with other travelers</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>❤️</Text>
            <Text style={styles.featureText}>Save your favorite places</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🗺️</Text>
            <Text style={styles.featureText}>Discover new destinations</Text>
          </View>
        </View>

        {/* Mission Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🚀 Our Mission</Text>
          <Text style={styles.cardDescription}>
            To create a community of travelers who inspire each other through shared experiences, 
            helping everyone discover the beauty of our world one destination at a time.
          </Text>
        </View>

        {/* App Info Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>ℹ️ App Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Version:</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Last Updated:</Text>
            <Text style={styles.infoValue}>January 2024</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Developer:</Text>
            <Text style={styles.infoValue}>TravelShare Team</Text>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Start Exploring"
            onPress={() => navigation.navigate('Dashboard')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFADD',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22668D',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  cardDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
});

export default Details;