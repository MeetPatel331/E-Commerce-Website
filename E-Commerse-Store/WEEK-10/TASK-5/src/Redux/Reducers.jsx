import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toastSuccessMessage } from "../components/RemovingDuplicate";
const BASE_URL = "http://localhost:3000"

export const fetchProducts = createAsyncThunk('fetch/allProducst', () => {
    return fetch(`${BASE_URL}/fetch/products`).then((res) => res.json()).then((data) => data)
})
export const fetchLimitedProducts = createAsyncThunk('fetch/limitedproducts', () => {
    return fetch(`${BASE_URL}/fetch/products`).then((res) => res.json()).then((data) => data)
})
export const fetchSingleProduct = createAsyncThunk('fetch/singleProduct', (id) => {
    return fetch(`${BASE_URL}/fetch/signleProduct?id=${id}`).then((res) => res.json()).then((data) => data)
})


const Reducer = createSlice({
    name: 'products',
    initialState: {
        product: [],
        loading: false,
        cart: [],
        singleProduct: {},
        error: false,
        sliderImage: [],
        currentCart: [],
        loggedIn: false,
        search: []
    },
    reducers: {
        addCart: (state, action) => {
            const user = localStorage.getItem('userId')
            if (user) {
                axios.post(`${BASE_URL}/cart/addcart`, {
                    productId: action.payload.productId,
                    userId: user, quantity: action.payload.quantity
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }).then((res) => {
                    toastSuccessMessage('Added to cart')
                    axios.post(`${BASE_URL}/cart/getCart?id=${user}`, {}, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    }).then((res) => {
                        state.cart = res.data
                    }).catch((err) => {
                        console.log(err)
                    })
                }).catch((err) => {
                    console.log(err)
                })
            } else {
                const savedCart = JSON.parse(localStorage.getItem('cart')) || []
                const itemIndex = savedCart.findIndex((item) => item.productId === action.payload.productId)
                if (itemIndex > -1) {
                    savedCart[itemIndex].quantity += action.payload.quantity
                }
                else {
                    savedCart.push({ productId: action.payload.productId, quantity: action.payload.quantity })
                }
                state.cart = savedCart
                localStorage.setItem('cart', JSON.stringify(savedCart))
                console.log(localStorage.getItem('cart'))
            }
        },
        manageQuantity: (state, action) => {
            for (let i = 0; i < state.cart.length; i++) {
                if (parseInt(state.cart[i].id) === parseInt(action.payload.id)) {
                    state.cart[i].quantity = parseInt(action.payload.newQuantity);
                    break;
                }
            }
        },
        deleteItemfromCart: (state, action) => {
            state.cart = state.cart.filter((item) => item.id != action.payload.id)
        },
        emptyCart: (state) => {
            state.cart = []
        },

        currentCart: (state) => {
            for (let i = 0; i < state.cart.length; i++) {
                axios.get(`${BASE_URL}/fetch/signleproduct?id=${state.cart[i].productId}`).then((res) => {
                    state.currentCart.push(Object.assign(res.data, state.cart[i]))
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
        , clearSearch: (state) => {
            state.search = []
        },
        logout: (state) => {
            state.cart = []
        },
        displayCart: (state, action) => {
            state.cart = action.payload.data
        },
        login: (state, action) => {
            let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
            const id = action.payload.id
            for (let i of cart) {
                axios.post(`${BASE_URL}/cart/addcart`, {
                    productId: i.productId,
                    userId: id, quantity: i.quantity
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }).then((res) => {
                    console.log(res.data)
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.pending, (state) => {
            state.loading = true
        }),
            builder.addCase(fetchProducts.fulfilled, (state, action) => {
                state.product = action.payload
                state.loading = false
                state.error = false
            }),
            builder.addCase(fetchProducts.rejected, (state) => {
                state.error = true
            }),
            builder.addCase(fetchLimitedProducts.fulfilled, (state, action) => {
                state.sliderImage = state.sliderImage.concat(action.payload)
                state.loading = false
            }),
            builder.addCase(fetchLimitedProducts.pending, (state) => {
                state.loading = true
            }),
            builder.addCase(fetchSingleProduct.fulfilled, (state, action) => {
                state.singleProduct = action.payload
                state.loading = false
            }),
            builder.addCase(fetchSingleProduct.pending, (state) => {
                state.loading = true
            })
    }
})

export const { addCart, displayCart, manageQuantity, login, logout, deleteItemfromCart, emptyCart, currentCart, clearSearch } = Reducer.actions
export const ProductReducer = Reducer.reducer