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
    let productParent = document.getElementById("productParent");
    productParent.innerHTML = "";
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
        productParent.innerHTML += `<div class="bg-white rounded-lg shadow-lg overflow-hidden">
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
                ${userType === "user" ? `<div class="flex mt-4">
                        <button class="${isInCart ? 'RemoveCart bg-yellow-600' : 'addCart'} bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 w-full" id="addtoCartButton" onclick="cart(this , '${x.id}')">${isInCart ? '<i class="bi bi-cart3 pr-1" ></i> Remove' : 'Add to Cart'}</button>
                        <button class="ml-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 w-full" onclick="buynow('${x.id}')">Buy Now</button>
                    </div>` : `
                    <div class="flex mt-4">
                    <button class="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 w-full" onclick="reviews('${x.id}')">Reviews</button>
                    <button class="ml-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 w-full" onclick="deleteProd('${x.id}')">Delete</button>
                    </div>
                    `}
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



window.deleteProd = async (productId) => {
    // Show a SweetAlert confirmation dialog
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    });

    // If the user confirms, proceed with the delete operation
    if (result.isConfirmed) {
        try {
            // Delete the product document
            await deleteDoc(doc(db, "products", productId));

            // Delete documents in the "orders" collection where "productId" matches
            const ordersQuery = query(collection(db, "orders"), where("productId", "==", productId));
            const ordersSnapshot = await getDocs(ordersQuery);
            ordersSnapshot.forEach(async (orderDoc) => {
                await deleteDoc(orderDoc.ref);
            });

            // Delete documents in the "wishlist" collection where "productId" matches
            const wishlistQuery = query(collection(db, "wishlist"), where("productId", "==", productId));
            const wishlistSnapshot = await getDocs(wishlistQuery);
            wishlistSnapshot.forEach(async (wishlistDoc) => {
                await deleteDoc(wishlistDoc.ref);
            });

            Swal.fire(
                'Deleted!',
                'The product and related documents have been deleted.',
                'success'
            );
        } catch (error) {
            Swal.fire(
                'Error!',
                'There was an error deleting the product.',
                'error'
            );
        }
    }
};

