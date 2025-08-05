// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsTxz003FAcNZ-_4GJzWU4kNyMdibxHus",
  authDomain: "chatapp-eda5b.firebaseapp.com",
  projectId: "chatapp-eda5b",
  storageBucket: "chatapp-eda5b.firebasestorage.app",
  messagingSenderId: "948377219297",
  appId: "1:948377219297:web:ad89411aea848bcfb087a0",
  measurementId: "G-719W5ZP0BZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
