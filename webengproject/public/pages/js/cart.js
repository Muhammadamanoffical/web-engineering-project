import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, addDoc, query, where } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";


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

const cartLink = document.getElementById("cartLink");
let userObj = JSON.parse(localStorage.getItem("user") || "{}");

let cart = [];

if (userObj && userObj.userType === "user") {
    window.cart = async (button, productId) => {
        const cartCollection = collection(db, "cart");
        let cartArray = JSON.parse(localStorage.getItem("cartArray")) || [];

        if (button.classList.contains('addCart')) {
            button.classList.remove('addCart');
            button.classList.add('RemoveCart');
            button.innerHTML = '<i class="bi bi-cart3 pr-1"></i> Remove';

            try {
                await addDoc(cartCollection, { userId: userObj.id, productId });
                cartArray.push(productId);
                localStorage.setItem("cartArray", JSON.stringify(cartArray));
                Swal.fire({
                    icon: 'success',
                    title: 'Added to Cart',
                    text: 'Product has been added to your cart.',
                    confirmButtonText: 'OK'
                });
                if (window.location.pathname.endsWith('cart.html')) {
                    location.reload();
                }
            } catch (error) {
                console.error("Error adding document:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error adding the product to your cart.',
                    confirmButtonText: 'OK'
                });
            }
        } else {
            button.classList.remove('RemoveCart');
            button.classList.add('addCart');
            button.innerText = 'Add to cart';

            const q = query(cartCollection, where("userId", "==", userObj.id), where("productId", "==", productId));
            const querySnapshot = await getDocs(q);
            try {
                for (const doc of querySnapshot.docs) {
                    await deleteDoc(doc.ref);
                }
                cartArray = cartArray.filter(id => id !== productId);
                localStorage.setItem("cartArray", JSON.stringify(cartArray));
                Swal.fire({
                    icon: 'success',
                    title: 'Removed from Cart',
                    text: 'Product has been removed from your cart.',
                    confirmButtonText: 'OK'
                });
                if (window.location.pathname.endsWith('cart.html')) {
                    location.reload();
                }
            } catch (error) {
                console.error("Error removing document:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error removing the product from your cart.',
                    confirmButtonText: 'OK'
                });
            }
        }

        updateCartCount();
        updateButtonState(productId);
    }

    const updateButtonState = (productId) => {
        const button = document.querySelector(`[data-product-id="${productId}"]`);
        let cartArray = JSON.parse(localStorage.getItem("cartArray")) || [];
        if (cartArray.includes(productId)) {
            button.classList.remove('addCart');
            button.classList.add('RemoveCart');
            button.innerHTML = '<i class="bi bi-cart3 pr-1"></i> Remove';
        } else {
            button.classList.remove('RemoveCart');
            button.classList.add('addCart');
            button.innerText = 'Add to cart';
        }
    };

    const updateCartCount = async () => {
        if (userObj.userType === "user") {
            const q = query(collection(db, "cart"), where("userId", "==", userObj.id));
            const querySnapshot = await getDocs(q);
            cart = querySnapshot.docs.map(doc => doc.data().productId);
            cartLink.innerHTML = `<i class="bi bi-cart3 pr-1"></i> Cart (${cart.length})`;
            fetchProducts(cart);
            localStorage.setItem("cartArray", JSON.stringify(cart));
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        updateCartCount();
        document.querySelectorAll('.cart-button').forEach(button => {
            const productId = button.getAttribute('data-product-id');
            updateButtonState(productId);
        });
    });
}
let products = [];
let cartProducts = JSON.parse(localStorage.getItem("cartArray")) || [];

const fetchProducts = async () => {
    const reference = collection(db, "products");
    const querySnapshot = await getDocs(reference);

    // Clear the products array before refilling it
    products = [];

    querySnapshot.forEach((doc) => {
        let product = {
            id: doc.id,
            ...doc.data()
        };
        if (cartProducts.includes(doc.id)) {
            products.push(product);
        }
    });
    RenderCart(products);
};
const RenderCart = async (products) => {
    const cartContainer = document.getElementById("cartContainer");
    cartContainer.innerHTML = "";
    products.forEach((product) => {
        const isInCart = cartProducts.includes(product.id);
        const truncatedDesc = product.productDesc.length > 100 ? product.productDesc.substring(0, 30) + '...' : product.productDesc;

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="card-body">
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img src="${product.productImage}" alt="" class="w-full h-48 object-contain">
                    <div class="p-4">
                        <div class="flex items-center mb-2">
                            <h3 class="text-lg font-bold">${product.productName}</h3>
                        </div>
                        <p class="text-gray-600 mb-4">${truncatedDesc}</p>
                        <span class="block text-gray-900 font-bold mb-6">$${product.productPrice}</span>
                        <div class="flex mt-4">
                            <button class="${isInCart ? 'RemoveCart bg-yellow-600' : 'addCart'} bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 w-full"  onclick="cart(this , '${product.id}')">${isInCart ? '<i class="bi bi-cart3 pr-1" ></i> Remove' : 'Add to Cart'}</button>
                            <button class="ml-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 w-full" onclick="buynow('${product.id}')">Buy Now</button>
                        </div>
                    </div>
                </div>
            </div>`;
        cartContainer.appendChild(card);
    });
};
fetchProducts();

// Ensure the fetchProducts function is defined and correctly retrieves products
// document.addEventListener('DOMContentLoaded', fetchProducts);

