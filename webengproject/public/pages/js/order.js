import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";


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

let products = [];
let orders = [];

const fetchProducts = async () => {
    const reference = collection(db, "products");
    const querySnapshot = await getDocs(reference);

    querySnapshot.forEach((doc) => {
        let product = {
            id: doc.id,
            ...doc.data()
        };
        products.push(product);
    });
};

const fetchOrders = async () => {
    const ref = collection(db, "orders");
    const querySnapshot = await getDocs(ref);

    querySnapshot.forEach((doc) => {
        let obj = {
            id: doc.id,
            ...doc.data(),
        };
        orders.push(obj);
    });
};

const renderOrder = async () => {
    await fetchOrders();
    await fetchProducts();

    const orderTr = document.getElementById("orderTr");

    orders.forEach(order => {
        let orderProduct = products.find(product => product.id === order.productId);
        if (orderProduct) {
            orders.forEach((x) => {
                if (x.id === order.id) {
                    orderTr.innerHTML += `
                    <tr>
                        <td class="px-4 py-2 text-gray-700">${order.name}</td>
                        <td class="px-4 py-2 text-gray-700">${order.email}</td>
                        <td class="px-4 py-2 text-gray-700">${orderProduct.productName}</td>
                        <td class="px-4 py-2 text-gray-700">${order.address}</td>
                        <td class="px-4 py-2 text-gray-700">$ ${orderProduct.productPrice}</td>
                        <td class="px-4 py-2 text-gray-700"><img src="${orderProduct.productImage}" alt="Product Image" class="w-16 h-16 object-cover"></td>
                    </tr>`;
                }
            })
        }
    });
};

renderOrder();