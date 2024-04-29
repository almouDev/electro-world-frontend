import Header from "../Components/Header";
import {Outlet} from "react-router-dom";
import {Alert} from "react-bootstrap";
import React, {useState} from "react";
import Footer from "../Components/Footer";
import {getCartSize} from "../Services/services/GestionPanier";
const AlertPanierSetShow=React.createContext()
const CartCounterContext=React.createContext()
const Home=()=>{
    const [show,setShow]=useState(false)
    const [CartCounter,setCartCounter]=useState(getCartSize())
    return(
        <CartCounterContext.Provider value={{CartCounter:CartCounter,setCartCounter:setCartCounter}}>
        <AlertPanierSetShow.Provider value={setShow}>
            {show?
            <Alert className={"text-white text-center bg-success fixed-top"}  style={{zIndex:200000}} variant={"success"} dismissible onClose={()=>{setShow(false)}}>
                <h4>Produit ajouté avec succés</h4>
            </Alert>:""}
            <Outlet/>
        </AlertPanierSetShow.Provider>
        </CartCounterContext.Provider>
    )
}
export {AlertPanierSetShow,Home,CartCounterContext}