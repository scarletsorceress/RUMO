import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "rumo-69140.firebaseapp.com",
  projectId: "rumo-69140",
  storageBucket: "rumo-69140.firebasestorage.app",
  messagingSenderId: "792365190957",
  appId: "1:792365190957:web:aeba41492e9b49cd650da4",
  measurementId: "G-B7YLP9BBE9"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Auth com persistência configurada para React Native e Firestore
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);