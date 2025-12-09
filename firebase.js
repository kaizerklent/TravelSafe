// firebase.js
import { initializeApp } from "firebase/app";
import { 
  initializeAuth, 
  getReactNativePersistence,
  GoogleAuthProvider 
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDMy_514I6hK2xr0c5jlUGNRZruRwSUpxE",
  authDomain: "travelsafe-997b2.firebaseapp.com",
  databaseURL: "https://travelsafe-997b2-default-rtdb.firebaseio.com",
  projectId: "travelsafe-997b2",
  storageBucket: "travelsafe-997b2.firebasestorage.app",
  messagingSenderId: "90039437537",
  appId: "1:90039437537:web:8e09f574ae89fe3dcb4fa0",
  measurementId: "G-BQ811E7H2E",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
