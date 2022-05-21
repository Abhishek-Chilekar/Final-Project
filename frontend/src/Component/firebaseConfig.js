// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage } from "firebase/storage";
import "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRi_3cKEFj_hgt8yiTnXk9rkIZ3hpl0ik",
  authDomain: "final-project-frontend-3b2a5.firebaseapp.com",
  projectId: "final-project-frontend-3b2a5",
  storageBucket: "final-project-frontend-3b2a5.appspot.com",
  messagingSenderId: "442588508545",
  appId: "1:442588508545:web:bca5798498210337b93880"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// export const db = getFirestore();

