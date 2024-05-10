
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";




const firebaseConfig = {
  apiKey: "AIzaSyCd162qJLz2CmpLB5toWZ59U9F2wPsrRao",
  authDomain: "todo-c2ebc.firebaseapp.com",
  projectId: "todo-c2ebc",
  storageBucket: "todo-c2ebc.appspot.com",
  messagingSenderId: "527036943420",
  appId: "1:527036943420:web:d392a4d66fb34e6a204739"
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const todoRef = collection(db,"todo")