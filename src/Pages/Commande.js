import PropTypes from "prop-types";
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import HttpService from "../Services/services/HttpService.ts";
import axios from "axios";
import {totalPanier} from "./Panier";
import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js";
import {AuthenticatedUser} from "../Services/services/Authentication";
import {Alert, Spinner} from "react-bootstrap";
import {CartCounterContext} from "./Home";

const finaliserCommande=(panier,userDetails,payed,actions)=>{
    actions.setShowSpinner(true)
    const div=document.getElementById("command_details")
    div.style.opacity="0.50"
    const interval=setInterval(()=>{
        clearInterval(interval)
        const data={payed:payed,user:userDetails,articles:panier.map(ele=>{
            return {article:ele.product,quantity:ele.quantity}
        })}
        let user=AuthenticatedUser()
        axios.post("http://localhost:8080/commander",data,{headers:HttpService.getAuthorizationToken().set("Content-Type","Application/json")})
            .then(response=>{
                localStorage.removeItem("client_cart")
                actions.setCartCount(0)
                actions.setShowAlert(true)
                const timeout=setTimeout(()=>{actions.redirect("/")},5000)
                actions.setShowSpinner(false)
            })
            .catch(error=>{
                actions.setIsSumitable(true)
                actions.setShowSpinner(true)
                div.style.opacity="1"
            })
    },10000)
}
const Commande=({},context)=>{
    const redirect=useNavigate()
    const [showSpinner,setShowSpinner]=useState(false)
    const location=useLocation()
    const [showAlert,setShowAlert]=useState(false)
    const authenticatedUser=context.authenticatedUser
    const [userDetails,setUserDetails]=useState(null)
    const [panier,setPanier]=useState([])
    const setCartCount=useContext(CartCounterContext).setCartCounter
    const [fundingSource,setFundingSource]=useState("paylater")
    const [isSumitable,setIsSumitable]=useState(!fundingSource==="paylater")
    const options={
        currency:"USD",
        "client-id":"ATUmTB-ZPPgUIY9hUUa0U9WMYzoXPNb94OrC7BuDtkz9ztjhqCZdRjRSYiTuPGeQB5KBt8jxv7dzTvwc",
        intent:"capture",
        components:"buttons,marks,funding-eligibility"
    }
    const imgSrc="http://localhost:8080/products/images/"
    useEffect(()=>{
        if (authenticatedUser){
            axios.get("http://localhost:8080/utilisateurs/"+authenticatedUser.username,{headers:HttpService.getAuthorizationToken()})
                .then(response=>{
                    setUserDetails(response.data)
                })
            setPanier(JSON.parse(localStorage.getItem("client_cart")))
        }
    },[])
    const onChange=(event)=>{
        setFundingSource(event.target.value)}
    return <div className="justify-content-center row vh-100 align-items-center">
        {
            showAlert?
            <Alert className="text-center mx-auto fixed-top  bg-success" onClose={()=>{setShowAlert(false)}} variant="success" dismissible={true} >
                <h3>Votre commande est effectuée avec succés,vous serrez rédirigé dans quelques instants</h3>
            </Alert>:""
        }
        {showSpinner?
        <Spinner variant="primary" className="position-absolute top-50" style={{left:"50%"}}>
            <span className="visually-hidden"></span>
        </Spinner>:""
        }
        <div id="command_details">
        <h3 className="bg-warning text-center container mt-3 mb-0 ">Finalisation de la commande</h3>
    {
        authenticatedUser?<div className="bg-white container d-sm-flex justify-content-between">
            <div className="info-client bg-white col-sm-5 p-2">
                <h4>{userDetails?.nom} {userDetails?.prenom}</h4>
                <h4>Adresse</h4>
                <p>{userDetails?.adress}</p>
                <h4>Méthode de paiement</h4>
                <form className="col-sm-5">
                    <div className="d-flex  justify-content-between">
                        <label className="d-block" htmlFor="paie1">Paiement à la livraison </label>
                        <input id="paie1" className="d-block" name="paiement" type="radio" value="paylater" checked={fundingSource==="paylater"} onChange={onChange}/>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <label className={"d-block"} htmlFor="paie2" >Paiement par PayPal <span className="fa-brands fa-paypal"></span> </label>
                        <input checked={fundingSource==="paypal"} onChange={onChange} className="text-warning d-block" id="paie2" name="paiement" type="radio" value="paypal"/>
                    </div>
                </form>
                {
                    fundingSource==="paypal"?
                <div className="col-sm-5">
                <PayPalScriptProvider  options={options}>
                    <PayPalButtons fundingSource={fundingSource}
                                   style={{color:"blue"}}
                                   createOrder={(data,actions)=>{return createOrder(data,actions,Math.round(totalPanier(panier)*0.01))}}
                                   onApprove={(data,actions)=>{onApprove(data,actions)}}
                    />
                </PayPalScriptProvider>
                </div>:""
                }
            </div>
            <div className="bg-white col-sm-4">
                <h3 className="resume_commande">Résumé de  la commande</h3>
                {
                    panier?<>
                    {panier.map((ele,key)=>{
                        return <div key={key} className="d-flex">
                            <img className="d-block" src={`${imgSrc+ele.product.id}/${ele.product.image[0].image}`} width={"56px"} height={"56px"}/>
                            <div>
                                <p>{ele.product.designation}</p>
                                <p>{ele.quantity} articles</p>
                                <p>{ele.product.prix} DH</p>
                            </div>
                        </div>
                    })}

                    </>:""
                }
                <h3>{panier?.length} articles au total</h3>
                <h3>Total à payer: {totalPanier(panier)} DH</h3>
            </div>
        </div>:<Navigate to={`/login?message=Vous devez vous connecter avant de passer une commande`} state={{from:location}}/>
        }
        <div className="container d-flex justify-content-between">
            <button className="btn btn-danger">Annuler</button>
            {
             fundingSource==="paylater"?
                 <button disabled={isSumitable} onClick={
                     ()=>{
                         setIsSumitable(true)
                     finaliserCommande(panier,userDetails,false,{setShowAlert,setShowSpinner,setIsSumitable,redirect,setCartCount})
                 }}className="btn btn-warning">Confirmer la commande</button>:""
            }
        </div>
        </div>
        </div>
}
Commande.contextTypes={
    authenticatedUser:PropTypes.object
}
const createOrder=(data,actions,value)=>{
    return actions.order.create({
        purchase_units: [
            {
                amount: {
                    value: value,
                },
            },
        ],
    });
}
const onApprove=(data, actions) => {
    return actions.order.capture().then((details) => {
        const name = details.payer.name.given_name;
        alert(`Transaction completed by ${name}`);
    });
}
export {Commande}