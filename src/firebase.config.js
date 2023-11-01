// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyCa1G5sI-eL0m2c25mYStHguLkIutfPQx8",
  authDomain: "soft-app-4e576.firebaseapp.com",
  databaseURL: "https://soft-app-4e576-default-rtdb.firebaseio.com",
  projectId: "soft-app-4e576",
  storageBucket: "soft-app-4e576.appspot.com",
  messagingSenderId: "746321666156",
  appId: "1:746321666156:web:c6629d381287aaa6457849",
  measurementId: "G-13F2RFXP4G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app