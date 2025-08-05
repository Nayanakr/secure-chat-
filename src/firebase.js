// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCioy6Q0lh6n4J8H-kc6zKF9h88R-j5lyE",
  authDomain: "chat-app-e42d4.firebaseapp.com",
  projectId: "chat-app-e42d4",
  storageBucket: "chat-app-e42d4.appspot.com",
  messagingSenderId: "637806515846",
  appId: "1:637806515846:web:7741c45fa1703591b82307",
  measurementId: "G-H7ZQWFB0XH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
