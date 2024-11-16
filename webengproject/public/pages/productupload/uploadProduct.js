// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
import {
  getAuth,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
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


const productName = document.getElementById("productName");
const productDesc = document.getElementById("productDescription");
const productPrice = document.getElementById("productPrice");
const productCategory = document.getElementById("productCategory");
const productImage = document.getElementById("productImage");



window.uploadProduct = async () => {
  let obj = {
    productName: productName.value,
    productDesc: productDesc.value,
    productPrice: productPrice.value,
    productCategory: productCategory.value,
    productImage: productImage.value,
  };

  let reference = collection(db, "products");

  let res = await addDoc(reference, obj);

  window.location.href = '../../index.html';
};