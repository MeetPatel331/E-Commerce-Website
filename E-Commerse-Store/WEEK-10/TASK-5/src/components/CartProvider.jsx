import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, SetTotal] = useState(0)
  const userId = localStorage.getItem("userId");
  const BASE_URL = "http://localhost:3000"

  const countTotalPrice = (cart) => {
    let s = 0;
    for (let i of cart) {
      s += (i.quantity * i.price)
    }
    return s
  }


  useEffect(() => {
    const fetch = async () => {
      if (userId) {
        fetchCartFromDB();
      } else {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        const fullData = await Promise.all(
          savedCart.map(async ({ productId, quantity }) => {
            const response = await fetch(`${BASE_URL}/fetch/signleproduct?id=${productId}`);
            const productData = await response.json();
            return { ...productData, quantity };
          })
        );
        setCart(fullData);
        SetTotal(countTotalPrice(cart))
      }
    }
    fetch()
  }, [userId]);


  const fetchCartFromDB = async () => {
    const res = await axios.post(`${BASE_URL}/cart/getCart?id=${localStorage.getItem('userId')}`, {}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    },);
    if (res.data.length !== 0) {
      const fullData = await Promise.all(
        res.data.items.map(async ({ productId, quantity }) => {
          const response = await fetch(`${BASE_URL}/fetch/signleproduct?id=${productId}`);
          const productData = await response.json();
          return { ...productData, quantity };
        })
      );
      SetTotal(countTotalPrice(fullData))
      setCart(fullData);
    }
    else {
      setCart([])
      SetTotal(0)
    }
  };

  // Add Item to Cart (Handles both LocalStorage & DB)
  const addToCart = async (productId, quantity) => {
    if (userId) {
      await axios.post(`${BASE_URL}/cart/addcart`, { userId, productId, quantity }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      fetchCartFromDB();
    } else {
      // Save to LocalStorage
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const itemIndex = savedCart.findIndex((item) => item.productId === productId);

      if (itemIndex > -1) {
        savedCart[itemIndex].quantity += quantity;
      } else {
        savedCart.push({ productId, quantity });
      }

      localStorage.setItem("cart", JSON.stringify(savedCart));
      const fullData = await Promise.all(
        savedCart.map(async ({ productId, quantity }) => {
          const response = await fetch(`${BASE_URL}/fetch/signleproduct?id=${productId}`);
          const productData = await response.json();
          return { ...productData, quantity };
        })
      );
      setCart(fullData);
      SetTotal(countTotalPrice(fullData))
    }
  };

  // Update Cart Item
  const updateCartItem = async (productId, quantity) => {
    if (userId) {
      await axios.put(`${BASE_URL}/cart/updatecart`, { userId, productId, quantity }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      fetchCartFromDB();
    } else {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = savedCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      const fullData = await Promise.all(
        updatedCart.map(async ({ productId, quantity }) => {
          const response = await fetch(`${BASE_URL}/fetch/signleproduct?id=${productId}`);
          const productData = await response.json();
          return { ...productData, quantity };
        })
      );
      SetTotal(countTotalPrice(fullData))
      setCart(fullData);
    }
  };

  const loginCart = async () => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const userId = localStorage.getItem('userId');
    console.log(savedCart)
    for (const item of savedCart) {
      try {
        await axios.post(`${BASE_URL}/cart/addcart`, { productId: item.productId, userId, quantity: item.quantity }, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
      } catch (err) {
        console.error(err);
      }
    }
    localStorage.removeItem('cart')
    fetchCartFromDB()
  }

  const logout = () => {
    localStorage.removeItem('cart')
    setCart([])
  }
  // Remove Cart Item
  const removeFromCart = async (productId) => {
    if (userId) {
      await axios.delete(`${BASE_URL}/cart/removeCartItem`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        data: {
          productId, userId
        }
      });
      fetchCartFromDB();
    } else {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = savedCart.filter((item) => item.productId !== productId);

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      const fullData = await Promise.all(
        updatedCart.map(async ({ productId, quantity }) => {
          const response = await fetch(`${BASE_URL}/fetch/signleproduct?id=${productId}`);
          const productData = await response.json();
          return { ...productData, quantity };
        })
      );
      setCart(fullData);
      SetTotal(countTotalPrice(fullData))
    }
  };

  return (
    <CartContext.Provider value={{ cart, BASE_URL, loginCart, logout, total, addToCart, updateCartItem, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext)