import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyDn9Njr5TsztGdLOXXN56GYxbcV46DJJCg",
    authDomain: "smit-64d93.firebaseapp.com",
    projectId: "smit-64d93",
    storageBucket: "smit-64d93.appspot.com",
    messagingSenderId: "975993823274",
    appId: "1:975993823274:web:f6fdbfc1c17f2f851f6353",
    measurementId: "G-DSC9KCQ2QG"
  };


const app = initializeApp(firebaseConfig);
const db = getFirestore();

let products = [];
let userObj = JSON.parse(localStorage.getItem("user"));
let wishlistParent = document.getElementById("wishlistParent");

// Function to get the user's wishlist items
const getUserWishlist = async (userId) => {
    const wishlistQuery = query(collection(db, "wishlist"), where("userId", "==", userId));
    const querySnapshot = await getDocs(wishlistQuery);
    let wishlistItems = [];
    querySnapshot.forEach((doc) => {
        wishlistItems.push(doc.data().productId);
    });
    await getProducts(wishlistItems); // Fetch products based on wishlist items
    renderProducts(userObj.userType); // Call renderProducts after fetching products
    return wishlistItems;
};

// Function to fetch products
let getProducts = async (productIds) => {
    const reference = collection(db, "products");
    const querySnapshot = await getDocs(reference);

    products.length = 0;

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const id = doc.id;

        if (productIds.includes(id)) {
            let obj = {
                id: id,
                ...data,
            };
            products.push(obj);
        }
    });
};

// Function to render products
let renderProducts = async (userType) => {
    wishlistParent.innerHTML = "";
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
        wishlistParent.innerHTML += `<div class="bg-white rounded-lg shadow-lg overflow-hidden">
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
                <div class="flex mt-4">
                    <button class="${isInCart ? 'RemoveCart bg-yellow-600' : 'addCart'} bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 w-full" onclick="cart(this , '${x.id}')">${isInCart ? '<i class="bi bi-cart3 pr-1" ></i> Remove' : 'Add to Cart'}</button>
                    <button class="ml-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 w-full" onclick="buynow('${x.id}')">Buy Now</button>
                </div>
            </div>
        </div>`;
    });
};


// Function to toggle the star (wishlist) state
window.wishList = () => {
    let userObj = JSON.parse(localStorage.getItem("user"));

    if (userObj && userObj.userType === "user") {
        window.toggleStar = async (icon, productId) => {
            let obj = {
                userId: userObj.id,
                productId: productId,
            };

            if (icon.classList.contains('bi-star')) {
                icon.classList.remove('bi-star');
                icon.classList.add('bi-star-fill');

                // Add the object to Firestore
                let reference = collection(db, "wishlist");
                await addDoc(reference, obj);
            } else {
                icon.classList.remove('bi-star-fill');
                icon.classList.add('bi-star');

                // Remove the object from Firestore
                const q = query(collection(db, "wishlist"), where("userId", "==", userObj.id), where("productId", "==", productId));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });
            }
        }
    }
    getUserWishlist(userObj.id);
};

wishList();
