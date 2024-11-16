// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
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

const signupLink = document.getElementById("signupLink");
const loginLink = document.getElementById("loginLink");
const homeLink = document.getElementById("homeLink");
const uploadLink = document.getElementById("uploadLink");
const productLink = document.getElementById("productLink");
const orderLink = document.getElementById("orderLink");
const reviewLink = document.getElementById("reviewLink");
const wishLink = document.getElementById("wishLink");
const cartLink = document.getElementById("cartLink");
const logoutBtn = document.getElementById("logoutBtn");
const navName = document.getElementById("navName");


function init() {
  let userObj = localStorage.getItem("user");
  userObj = JSON.parse(userObj);

  if (!userObj) {
    signupLink.style.display = "inline";
    loginLink.style.display = "inline";
    homeLink.style.display = "none";
    uploadLink.style.display = "none";
    productLink.style.display = "none";
    orderLink.style.display = "none";
    reviewLink.style.display = "none";
    wishLink.style.display = "none";
    cartLink.style.display = "none";
    logoutBtn.style.display = "none";
    navName.style.display = "none";

  }
  if (userObj) {
    signupLink.style.display = "none";
    loginLink.style.display = "none";
    if (userObj.userType === "user") {
      uploadLink.style.display = "none";
      orderLink.style.display = "none";
      navName.style.display = "none";
      wishLink.style.display = "inline";
      productLink.style.display = "inline";
      homeLink.style.display = "inline";
      reviewLink.style.display = "inline";
      cartLink.style.display = "inline";

    }
    if (userObj.userType === "admin") {
      uploadLink.style.display = "inline";
      orderLink.style.display = "inline";
      navName.style.display = "inline";
      homeLink.style.display = "inline";
      productLink.style.display = "inline";
      reviewLink.style.display = "inline";
      cartLink.style.display = "none";
      wishLink.style.display = "none";
    }
    logoutBtn.className = "text-white mx-4 px-4 py-2 rounded-full bg-red-600 px-2 py-1 rounded hover:bg-red-700";
  }
}
init()

window.logout = () => {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("user");
      init()
    })
    .catch((err) => {
      alert(err.message);
    });
};
