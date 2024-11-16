// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import { getFirestore, doc, setDoc, collection, getDocs, getDoc, deleteDoc, addDoc, query, where, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

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
const db = getFirestore();


window.reviews = async (productId) => {
    const reference = collection(db, "products");
    const productDoc = await getDoc(doc(reference, productId));

    if (productDoc.exists()) {
        let product = {
            id: productDoc.id,
            ...productDoc.data()
        };
        localStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = "./givereview.html";
    } else {
        console.log("No such document!");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const productDetailsDiv = document.getElementById('reviewContainer');
    const product = JSON.parse(localStorage.getItem('selectedProduct'));

    if (product) {
        productDetailsDiv.innerHTML = `
                    <img src="${product.productImage}" alt="Product Image" class="w-full h-48 object-cover rounded-lg mb-4">
                    <h3 class="text-2xl font-bold text-theme-red mb-2">${product.productName}</h3>
                    <p class="text-gray-600 mb-4">${product.productDesc}</p>
                    <span class="block text-gray-900 font-bold mb-4">$${product.productPrice}</span>
                `;
    } else {
        productDetailsDiv.innerHTML = `<p>No product selected</p>`;
    }
});

function submitReview() {
    const name = document.getElementById('name').value;
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;

    let obj = {
        name: name,
        review: review,
    };

    console.log(obj);

    if (name && review) {
        const reviewCard = `
                    <div class="bg-white rounded-lg shadow-lg p-6">
                        <div class="flex items-center mb-4">
                            <div>
                                <h3 class="text-xl font-bold text-theme-red">${name}</h3>
                            </div>
                        </div>
                        <p class="text-gray-800 mb-4">${review}</p>
                        <div class="flex items-center">
                            <span class="text-theme-yellow mr-2">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</span>
                        </div>
                    </div>
                `;

        document.getElementById('reviewsContainer').insertAdjacentHTML('beforeend', reviewCard);

        // Clear the form
        document.getElementById('name').value = '';
        document.getElementById('review').value = '';
        document.getElementById('rating').value = '5';
    } else {
        alert('Please fill in all fields');
    }
}


submitReview();