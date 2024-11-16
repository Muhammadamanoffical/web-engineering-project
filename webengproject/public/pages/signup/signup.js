// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyDn9Njr5TsztGdLOXXN56GYxbcV46DJJCg",
  authDomain: "smit-64d93.firebaseapp.com",
  projectId: "smit-64d93",
  storageBucket: "smit-64d93.appspot.com",
  messagingSenderId: "975993823274",
  appId: "1:975993823274:web:f6fdbfc1c17f2f851f6353",
  measurementId: "G-DSC9KCQ2QG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

const username = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");

window.signup = () => {
  let obj = {
    username: username.value,
    email: email.value,
    password: password.value,
  };

  createUserWithEmailAndPassword(auth, obj.email, obj.password)



    .then((res) => {
      obj.id = res.user.uid;
      obj.userType = "user";
      delete obj.password;

      const refernce = doc(db, "users", obj.id);
      setDoc(refernce, obj)
        .then(() => {
          var userObj = JSON.stringify(obj);
          localStorage.setItem("user", userObj);
          window.location.replace("../login/login.html");
        })
        .catch((err) => {
          alert(err.message);
        });
    })
    .catch((err) => {
      alert(err.message);
    });
};
