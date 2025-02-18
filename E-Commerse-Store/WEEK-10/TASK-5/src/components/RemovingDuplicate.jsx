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


const RemovingDuplicate = () => {
    return <div>Removing Duplicate</div>;
};

export default RemovingDuplicate;