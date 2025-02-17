import { configureStore } from "@reduxjs/toolkit"
import { ProductReducer } from "./Reducers"
import { CartData } from "./CartReducers"


export const Stroe = configureStore({
    reducer: {
        productReducer: ProductReducer,
        cartReducer: CartData
    }
})