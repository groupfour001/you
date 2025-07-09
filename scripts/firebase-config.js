// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0tSzbBBGBuD0LjUdhKG0ecf4MnIBKJ8g",
  authDomain: "celebmingle-65ab9.firebaseapp.com",
  projectId: "celebmingle-65ab9",
  storageBucket: "celebmingle-65ab9.firebasestorage.app",
  messagingSenderId: "780456033185",
  appId: "1:780456033185:web:327cd2d465e208bfdee9e0"
};

// Initialize Firebase
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully');
    } else {
        console.log('Firebase already initialized');
    }
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
