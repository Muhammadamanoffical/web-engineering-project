// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

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

const email = document.getElementById("email");
const password = document.getElementById("password");

window.signIn = () => {
    var obj = {
        email: email.value,
        password: password.value,
    };
    signInWithEmailAndPassword(auth, obj.email, obj.password)


        .then(async (res) => {
            const id = res.user.uid;
            const reference = doc(db, "users", id);
            const snap = await getDoc(reference);

            if (snap.exists()) {
                var userObj = JSON.stringify(snap.data());
                localStorage.setItem("user", userObj);
                window.location.replace("../../index.html");
            }
            else {
                alert("Data Not Found");
            }
        })
        .catch((err) => {
            alert(err.message);
        });
};
