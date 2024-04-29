import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {serverAdress} from "../../../Pages/Constants";
import HttpService from "../../../Services/services/HttpService.ts";

const productSlice=createSlice({
    name:"products",
    initialState:{
        value:[],
    },
    reducers:{
        fetch:(state,action)=>{
            state.value=action.payload
        },
        remove:(state,action)=>{
            state.value=state.value.filter(product=>product.id!==action.payload.id)
        },
        update:(state,action)=>{
            state.value=state.value.map(product=>{
                return product.id==action.payload.id?action.payload:product
            })
        },
    }
})
export const {fetch,remove,update,nextPage}=productSlice.actions
export const initializeProducts=createAsyncThunk("products/fetch",async ()=>{
    const response=await HttpService.getProducts()
    return response.data.__embedded.articles
})

export const productReducer=productSlice.reducer