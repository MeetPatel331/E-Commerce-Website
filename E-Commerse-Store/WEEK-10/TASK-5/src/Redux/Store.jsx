import { configureStore } from "@reduxjs/toolkit"
import { ProductReducer } from "./Reducers"


export const Stroe = configureStore({
    reducer: {
        productReducer: ProductReducer,
    }
})