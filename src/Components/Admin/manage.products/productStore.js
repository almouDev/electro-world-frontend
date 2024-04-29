import {configureStore} from "@reduxjs/toolkit";
import {initializeProducts, productReducer} from "./productSlice";

export const productStore=configureStore({
    reducer:{
        products:productReducer
    }
})