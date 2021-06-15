import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyBNb2AU4Z5OhHLv59UURFfenkOAj4UAUJs",
  authDomain: "codeclass-bafdb.firebaseapp.com",
  databaseURL: "https://codeclass-bafdb-default-rtdb.firebaseio.com",
  projectId: "codeclass-bafdb",
  storageBucket: "codeclass-bafdb.appspot.com",
  messagingSenderId: "324605990237",
  appId: "1:324605990237:web:adfb7468ba0b7c666a04b4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;