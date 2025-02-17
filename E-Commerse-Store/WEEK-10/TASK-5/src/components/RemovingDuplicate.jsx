import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:3000';

// Function to remove duplicates
export const removeDuplicate = (original) => {
    const newArray = [];
    const seenIds = new Set();
    original.forEach((obj) => {
        if (!seenIds.has(obj._id)) {
            newArray.push(obj);
            seenIds.add(obj._id);
        }
    });
    return newArray;
};

// Filter items by category (e.g., "mobile")
export const filterArray = (original, category = 'mobile') => {
    return original.filter(obj => obj.category === category);
};

// Format price to 2 decimal places
export const fixingPrice = (price) => {
    return Number(price).toFixed(2);
};

// Toast notifications
export const toastSuccessMessage = (msg) => {
    toast.success(msg, { position: 'top-right' });
};

export const toastErrorMessage = (msg) => {
    toast.error(msg, { position: 'top-right' });
};

// Get cart item count
export const quantityCount = async () => {
    let c = 0;
    const userId = localStorage.getItem('userId');

    if (userId) {
        try {
            const { data } = await axios.post(`${BASE_URL}/cart/getCart?id=${userId}`, {}, {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            data.items.forEach(item => c += item.quantity);
        } catch (err) {
            console.error(err);
        }
    } else {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.forEach(item => c += item.quantity);
    }

    return c;
};

// Fetch product details by ID
export const convertToItems = async (itemObj) => {
    try {
        const { data } = await axios.get(`${BASE_URL}/fetch/signleproduct?id=${itemObj.productId}`, { withCredentials: true });
        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

// Retrieve cart from local storage
export const fetchFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('cart')) || [];
};

// Add item to cart
export const addToCart = async ({ productId, quantity }) => {
    const userId = localStorage.getItem('userId');

    if (userId) {
        try {
            await axios.post(`${BASE_URL}/cart/addcart`, { productId, userId, quantity }, {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            toastSuccessMessage('Added to cart');
        } catch (err) {
            console.error(err);
        }
    } else {
        const savedCart = fetchFromLocalStorage();
        const itemIndex = savedCart.findIndex(item => item.productId === productId);
        if (itemIndex > -1) {
            savedCart[itemIndex].quantity += quantity;
        } else {
            savedCart.push({ quantity, productId });
        }
        localStorage.setItem('cart', JSON.stringify(savedCart));
    }
};

// Remove item from cart
export const removeItem = async ({ productId }) => {
    const userId = localStorage.getItem('userId');

    if (userId) {
        try {
            const { data } = await axios.delete(`${BASE_URL}/cart/removeCartItem`, {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                data: { productId, userId }
            });
            toastSuccessMessage(data.message);
        } catch (err) {
            console.error(err);
        }
    } else {
        const savedCart = fetchFromLocalStorage();
        const updatedCart = savedCart.filter(item => item.productId !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
};

// Fetch cart data from DB
export const fetchFromDB = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return [];

    try {
        const { data } = await axios.post(`${BASE_URL}/cart/getCart?id=${userId}`, {}, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        return data.items;
    } catch (err) {
        console.error(err);
        return [];
    }
};

// Update cart item quantity
export const updateCart = async ({ productId, quantity }) => {
    const userId = localStorage.getItem('userId');

    if (userId) {
        try {
            await axios.put(`${BASE_URL}/cart/updatecart`, { productId, userId, quantity }, {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            toastSuccessMessage('Updated in cart');
        } catch (err) {
            console.error(err);
        }
    } else {
        const savedCart = fetchFromLocalStorage();
        const itemIndex = savedCart.findIndex(item => item.productId === productId);
        if (itemIndex > -1) {
            savedCart[itemIndex].quantity = quantity;
        }
        localStorage.setItem('cart', JSON.stringify(savedCart));
    }
};

// Sync guest cart to user account after login
export const loginCart = async () => {
    const cart = fetchFromLocalStorage();
    const userId = localStorage.getItem('userId');

    if (!userId || cart.length === 0) return;

    for (const item of cart) {
        try {
            await axios.post(`${BASE_URL}/cart/addcart`, { productId: item.productId, userId, quantity: item.quantity }, {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
        } catch (err) {
            console.error(err);
        }
    }
};

// Simple React component (optional, but seems unnecessary)
const RemovingDuplicate = () => {
    return <div>Removing Duplicate</div>;
};

export default RemovingDuplicate;