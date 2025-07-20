import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4JmlfJDx0zn5U4aoQGCngaf3wxqYQGbk",
  authDomain: "edhuru-e8fc8.firebaseapp.com",
  projectId: "edhuru-e8fc8",
  storageBucket: "edhuru-e8fc8.appspot.com",
  messagingSenderId: "870071399726",
  appId: "1:870071399726:web:57efffcf66ebc82f1f36bf",
  measurementId: "G-FN1BGYNLKS",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
