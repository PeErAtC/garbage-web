// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // นำเข้า Firebase Storage
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkipFIjQxZ1WKSPbOYOxKhLrYr8AeEX_Q",
  authDomain: "garbage-web-c9745.firebaseapp.com",
  projectId: "garbage-web-c9745",
  storageBucket: "garbage-web-c9745.appspot.com",
  messagingSenderId: "366697440874",
  appId: "1:366697440874:web:90b5c3fc04fcf8b20ccc13",
  measurementId: "G-SG2J1KJRMV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app); // เพิ่มบรรทัดนี้เพื่อใช้ Firebase Storage
const auth = getAuth(app);

export { db, storage, auth } ;
