import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBsTxz003FAcNZ-_4GJzWU4kNyMdibxHus",
  authDomain: "chatapp-eda5b.firebaseapp.com",
  projectId: "chatapp-eda5b",
  storageBucket: "chatapp-eda5b.firebasestorage.app",
  messagingSenderId: "948377219297",
  appId: "1:948377219297:web:ad89411aea848bcfb087a0",
  measurementId: "G-719W5ZP0BZ",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
