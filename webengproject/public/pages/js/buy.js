import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import { getFirestore, collection, getDocs, addDoc, query, where } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";


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
const analytics = getAnalytics(app);
const db = getFirestore();

let userObj = localStorage.getItem("user");
userObj = JSON.parse(userObj);

window.buynow = async (productId) => {
    localStorage.setItem("selectedProductId", productId);
    // Check the current page path
    if (window.location.pathname.endsWith('index.html')) {
        window.location.href = "./pages/pagesfile/buynow.html";
    } else {
        window.location.href = "../pagesfile/buynow.html";
    }
};

document.addEventListener("DOMContentLoaded", async () => {
    const buyProd = document.getElementById("buyProd");
    const cancelButton = document.getElementById('cancelButton');
    const purchaseForm = document.getElementById('purchaseForm');

    const productId = localStorage.getItem("selectedProductId");

    const fetchProduct = async (productId) => {
        const reference = collection(db, "products");
        const querySnapshot = await getDocs(reference);

        let product = null;
        querySnapshot.forEach((doc) => {
            if (doc.id === productId) {
                product = {
                    id: doc.id,
                    ...doc.data()
                };
            }
        });

        return product;
    };

    const renderProduct = async () => {
        const product = await fetchProduct(productId);
        if (product) {
            // Get current cart state from localStorage
            let cartArray = JSON.parse(localStorage.getItem("cartArray")) || [];
            const isInCart = cartArray.includes(product.id);

            buyProd.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6 mx-12 md:flex overflow-hidden">
                <img src="${product.productImage}" alt="Product Image" class="product-image rounded-lg mb-4 md:mb-0">
                <div class="md:ml-6 flex-1">
                    <h2 class="text-2xl font-bold mb-2">${product.productName}</h2>
                    <p class="text-gray-600 mb-4">${product.productDesc}</p>
                    <div class="flex items-center mb-4">
                        <span class="text-gray-700 text-lg">Price:</span>
                        <span class="text-2xl font-bold text-gray-900 ml-2">$${product.productPrice}</span>
                    </div>
                    <div class="flex items-center mb-4">
                        <span class="text-gray-700 text-lg">Quantity:</span>
                        <input type="number" class="ml-2 border border-gray-300 rounded-lg p-2 w-16 text-center" value="1" min="1">
                    </div>
                    <div class="mt-6 flex">
                        <button id="addCartbutton" class="${isInCart ? 'RemoveCart' : 'addCart'} bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600 w-full md:w-auto" onclick="cart(this , '${product.id}')">
                            ${isInCart ? '<i class="bi bi-cart3 pr-1" ></i> Remove from Cart' : 'Add to Cart'}
                        </button>
                        <button class="ml-4 bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 w-full md:w-auto" id="buyNowButton">Buy Now</button>
                    </div>
                </div>
            </div>
        `;
        } else {
            buyProd.innerHTML = `<p>Product not found</p>`;
        }
    };

    await renderProduct();

    // JavaScript to handle modal display and form functionality
    const buyNowBtn = document.getElementById('buyNowButton');
    const buyNowModal = document.getElementById('buyNowModal');

    // Show the modal
    buyNowBtn.addEventListener('click', function () {
        buyNowModal.classList.remove('hidden');
    });

    // Hide the modal
    cancelButton.addEventListener('click', function () {
        buyNowModal.classList.add('hidden');
    });

    // Handle form submission
    purchaseForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form from submitting

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;

        // Display form values (for debugging)
        alert(`Name: ${name}\nEmail: ${email}\nAddress: ${address}`);

        buyNowModal.classList.add('hidden'); // Hide the modal
    });
});


const name = document.getElementById("name");
const email = document.getElementById("email");
const address = document.getElementById("address");

window.purchase = async () => {
    const productId = localStorage.getItem("selectedProductId");
    let obj = {
        name: name.value,
        email: email.value,
        address: address.value,
        productId: productId,
        userId: userObj.id,
    }
    let reference = collection(db, "orders");
    let res = await addDoc(reference, obj);
    console.log("Order placed:", res);
    name.value = '';
    email.value = '';
    address.value = '';
    Swal.fire({
        title: "Almost Ready to Deliver!",
        text: "Order placed successfully!",
        icon: "success"
    });
    buyNowModal.classList.add('hidden');
}
