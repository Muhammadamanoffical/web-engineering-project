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
let products = [];

let getProducts = async (userType) => {
    const reference = collection(db, "products");
    const querySnapshot = await getDocs(reference);
    querySnapshot.forEach((doc) => {
        let obj = {
            id: doc.id,
            ...doc.data(),
        };
        products.push(obj);
    });
    renderProducts(userType);
};

let renderProducts = async (userType) => {
    let reviewParent = document.getElementById("reviewParent");
    reviewParent.innerHTML = "";
    let wishlist = [];
    let cartArray = JSON.parse(localStorage.getItem("cartArray")) || [];

    if (userType === "user") {
        const q = query(collection(db, "wishlist"), where("userId", "==", JSON.parse(localStorage.getItem("user")).id));
        const querySnapshot = await getDocs(q);
        wishlist = querySnapshot.docs.map(doc => doc.data().productId);
    }

    products.forEach((x) => {
        const truncatedDesc = x.productDesc.length > 100 ? x.productDesc.substring(0, 30) + '...' : x.productDesc;
        const isInWishlist = wishlist.includes(x.id);
        const isInCart = cartArray.includes(x.id);
        reviewParent.innerHTML += `<div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src="${x.productImage}" alt="" class="w-full h-48 object-contain">
            <div class="p-4">
                <div class="flex items-center mb-2">
                    <h3 class="text-lg font-bold">${x.productName}</h3>
                    ${userType === "user" ? `<span class="ml-auto">
                        <i class="bi ${isInWishlist ? 'bi-star-fill' : 'bi-star'} text-yellow-500" onclick="toggleStar(this, '${x.id}')"></i>
                    </span>` : ''}
                </div>
                <p class="text-gray-600 mb-4">${truncatedDesc}</p>
                <span class="block text-gray-900 font-bold mb-6">$${x.productPrice}</span>
                <button class="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 w-full"  onclick="reviews('${x.id}')">Reviews</button>
            </div>
        </div>`;
    });
};



window.wishList = () => {
    let userObj = localStorage.getItem("user");
    userObj = JSON.parse(userObj);

    if (userObj) {
        if (userObj.userType === "user") {
            window.toggleStar = async (icon, productId) => {
                let obj = {
                    userId: userObj.id,
                    productId: productId,
                };
                console.log(obj);
                if (icon.classList.contains('bi-star')) {
                    icon.classList.remove('bi-star');
                    icon.classList.add('bi-star-fill');

                    // Add the object to Firestore
                    let reference = collection(db, "wishlist");

                    let res = await addDoc(reference, obj);
                } else {
                    icon.classList.remove('bi-star-fill');
                    icon.classList.add('bi-star');

                    // Remove the object from Firestore
                    const q = query(collection(db, "wishlist"), where("userId", "==", userObj.id), where("productId", "==", productId));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach(async (doc) => {
                        await deleteDoc(doc.ref);
                    });
                };
            }
        }
    }
    getProducts(userObj.userType);
};

wishList();

window.reviews = async (productId) => {
    const reference = collection(db, "products");
    const productDoc = await getDoc(doc(reference, productId));

    if (productDoc.exists()) {
        let product = {
            id: productDoc.id,
            ...productDoc.data()
        };
        localStorage.setItem('selectedProduct', JSON.stringify(product));
        if (window.location.pathname.endsWith('index.html')) {
            window.location.href = "./pages/pagesfile/givereview.html";
        } else {
            window.location.href = "./givereview.html";
        }
    } else {
        console.log("No such document!");
    }
};

document.addEventListener("DOMContentLoaded", async () => {
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


window.submitReview = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const product = JSON.parse(localStorage.getItem('selectedProduct'));
    const name = user ? user.username : 'Anonymous';
    const review = document.getElementById('review').value.trim();
    const rating = parseInt(document.getElementById('rating').value, 10);

    if (!review || isNaN(rating) || rating < 1 || rating > 5) {
        alert('Please fill in all fields with valid data.');
        return;
    }

    let obj = {
        name: name,
        productId: product.id,
        review: review,
        rating: rating,
    };

    try {
        // Add the review to Firestore
        await addDoc(collection(db, "reviews"), obj);

        // Clear the form
        document.getElementById('review').value = '';
        document.getElementById('rating').value = '5';

    } catch (error) {
        console.error("Error submitting review:", error);
        alert('Failed to submit the review. Please try again.');
    }
}

const loadReviews = async (productId) => {
    const reviewsContainer = document.getElementById('reviewsContainer');
    reviewsContainer.innerHTML = ''; // Clear existing reviews

    try {
        const ref = collection(db, "reviews");
        const q = query(ref, where("productId", "==", productId));
        const querySnapshot = await getDocs(q);

        console.log("Reviews fetched:", querySnapshot.docs.length); // Debugging statement

        if (querySnapshot.empty) {
            reviewsContainer.innerHTML = `<p>No reviews yet</p>`;
            return;
        }

        querySnapshot.forEach(doc => {
            const data = doc.data();
            const reviewCard = `
            <div class="bg-white rounded-lg shadow-lg p-6 mb-4" style="border: 1px solid #FF4500;">
                <div class="flex flex-col h-full justify-between">
                    <div>
                        <h3 class="text-xl font-bold text-theme-red text-center mb-6">${data.name}</h3>
                        <p class="text-gray-800 mb-4 text-justify">${data.review}</p>
                    </div>
                    <div class="flex items-center justify-center mt-auto">
                        <span class="stars text-theme-yellow mr-2">${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)}</span>
                    </div>
                </div>
            </div>`;

            reviewsContainer.insertAdjacentHTML('beforeend', reviewCard);
        });
    } catch (error) {
        console.error("Error loading reviews:", error);
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    const productId = JSON.parse(localStorage.getItem("selectedProduct"));
    console.log("Loading reviews for productId:", productId.id);
    await loadReviews(productId.id);
});


const reviewsform = document.getElementById("reviewsform");
function init() {
    let userObj = localStorage.getItem("user");
    userObj = JSON.parse(userObj);
    if (userObj) {
        signupLink.style.display = "none";
        loginLink.style.display = "none";
        if (userObj.userType === "admin") {
            reviewsform.style.display = "none";
        }
    }
}

init();