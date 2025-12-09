// App.js
import { LogBox } from 'react-native';
import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Screens
import Dashboard from './Screens/Dashboard';
import LoginScreen from './Screens/LoginScreen';
import CreateAccScreen from './Screens/CreateAccScreen';
import Profile from './Screens/Profile';
import Details from './Screens/Details';
import Settings from './Screens/Settings';
import AddPost from './Screens/AddPost';
import EditPostScreen from './Screens/EditPostScreen';
import PostDetailScreen from './Screens/PostDetailScreen';

// Components
import CustomDrawerContent from './components/CustomDrawerContent';

// Context
import { PostProvider } from './Context/PostContext';

LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <PostProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="CreateAccScreen" component={CreateAccScreen} />
          <Stack.Screen name="Main" component={DrawerNavigator} />
          <Stack.Screen name="AddPost" component={AddPost} />
          <Stack.Screen name="EditPost" component={EditPostScreen} />
          <Stack.Screen name="PostDetail" component={PostDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PostProvider>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Details" component={Details} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
}
