import firebase from 'firebase';
import { createRequire } from "module";
const require = createRequire(import.meta.url)
require('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyB6ZSRqp3bT2RRKoKimxYEp7aZogMqNWoA",
    authDomain: "ravel-easy-a1.firebaseapp.com",
    databaseURL: "https://ravel-easy-a1.firebaseio.com",
    projectId: "ravel-easy-a1",
    storageBucket: "ravel-easy-a1.appspot.com",
    messagingSenderId: "153221922731",
    appId: "1:153221922731:web:5b4b6fdc6afb120a4edcee"
  };
  firebase.initializeApp(firebaseConfig);

export default firebase.firestore();