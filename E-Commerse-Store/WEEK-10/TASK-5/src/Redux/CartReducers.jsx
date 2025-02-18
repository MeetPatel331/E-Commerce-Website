import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../Config";
export const fetchCartFromDB = createAsyncThunk(
    'cart/fetchFromDB',
    () => {
        return fetch(`${BASE_URL}/cart/getCart?id=${localStorage.getItem('userId')}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
            method: 'POST'
        }).then((res) => res.json()).then((data) => data.items)
    }
);

const CartReducer = createSlice({
    name: 'CartReducer',
    initialState: {
        cart: [],
        quantityCount: 0,
        total: 0,
        infoData: [],
        loading: ''
    },
    reducers: {
        addCart: (state, action) => {
            if (localStorage.getItem('userId')) {
                axios.post(`${BASE_URL}/cart/addcart`, {
                    productId: action.payload.productId,
                    userId: localStorage.getItem('userId'), quantity: action.payload.quantity
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }).then((res) => {
                    toastSuccessMessage('Added to cart')

                }).catch((err) => {
                    console.log(err)
                })
            }
            else {
                const savedCart = JSON.parse(localStorage.getItem('cart')) || []
                const itemIndex = savedCart.findIndex((item) => item.productId === productId)
                if (itemIndex > -1) {
                    savedCart[itemIndex].quantity += quantity
                }
                else {
                    savedCart.push({ quantity, productId })
                }
                localStorage.setItem('cart', JSON.stringify(savedCart))
                console.log(localStorage.getItem('cart'))
            }
        },
        fetchData: async (state, action) => {

            let info = await Promise.all(
                action.payload.data.map(async ({ productId, quantity }) => {
                    const response = await fetch(`${BASE_URL}/fetch/signleproduct?id=${productId}`);
                    const productData = await response.json();
                    return { ...productData, quantity };
                })
            )
            console.log(info)
            state.cart = info
        },
        fetchFromLS: (state) => {
            console.log('came')
            const savedCart = JSON.parse(localStorage.getItem('cart')) || []
            if (savedCart) {
                state.infoData = savedCart
            }
            else {
                state.infoData = []
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartFromDB.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(fetchCartFromDB.fulfilled, (state, action) => {
                console.log(action.payload)
                state.loading = 'succeeded';
                state.infoData = action.payload;
            })
            .addCase(fetchCartFromDB.rejected, (state, action) => {
                state.loading = 'failed';
                state.error = action.payload; // or action.error.message if needed
                console.log('fetchCartFromDB rejected', action);
            });
    },
})


export const { addCart, fetchData, fetchFromLS } = CartReducer.actions
export const CartData = CartReducer.reducer