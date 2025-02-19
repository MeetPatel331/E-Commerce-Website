import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { BASE_URL } from "../Config";
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, SetTotal] = useState(0)
  const [loading, SetLoading] = useState(false)
  const [admin, SetisAdmin] = useState(false)
  const userId = localStorage.getItem("userId");
  const [user, setuser] = useState({
    name: '', email: ''
  })

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
        const res = await axios.post(`${BASE_URL}/auth/profile?id=${userId}`, {}, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        })
        setuser({ ...user, name: `${res.data.user.firstname} ${res.data.user.lastname}`, email: res.data.user.email })
        fetchCartFromDB();
      } else {
        SetLoading(true)
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
        SetLoading(false)
      }
    }
    fetch()
  }, [userId]);


  const fetchCartFromDB = async () => {
    SetLoading(true)
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
      SetLoading(false)
    }
    else {
      setCart([])
      SetTotal(0)
      SetLoading(false)
    }
  };

  // Add Item to Cart (Handles both LocalStorage & DB)
  const addToCart = async (productId, quantity) => {
    if (userId) {
      SetLoading(true)
      await axios.post(`${BASE_URL}/cart/addcart`, { userId, productId, quantity }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      SetLoading(false)
      fetchCartFromDB();
    } else {
      SetLoading(true)
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
      SetLoading(false)
    }
  };


  const updateCartItem = async (productId, quantity) => {
    if (userId) {
      SetLoading(true)
      await axios.put(`${BASE_URL}/cart/updatecart`, { userId, productId, quantity }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      SetLoading(false)
      fetchCartFromDB();
    } else {
      SetLoading(true)
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
      SetLoading(false)
    }
  };

  const handleAdminLogin = () => {
    if (localStorage.getItem('admin')) {
      SetisAdmin(true)
    }
    else {
      SetisAdmin(false)
    }
  }

  const loginCart = async () => {
    SetLoading(true)
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
    SetLoading(false)
    fetchCartFromDB()
  }

  const logout = () => {
    SetLoading(true)
    localStorage.removeItem('cart')
    setCart([])
    SetLoading(false)
  }
  // Remove Cart Item
  const removeFromCart = async (productId) => {
    if (userId) {
      SetLoading(true)
      await axios.delete(`${BASE_URL}/cart/removeCartItem`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        data: {
          productId, userId
        }
      });
      SetLoading(false)
      fetchCartFromDB();
    } else {
      SetLoading(true)
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
      SetLoading(false)
    }
  };

  return (
    <CartContext.Provider value={{ cart, handleAdminLogin, user, admin, loading, BASE_URL, loginCart, logout, total, addToCart, updateCartItem, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext)