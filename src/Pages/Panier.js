import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {ajouterPanier, decrementProduct, deleteProduct} from "../Services/services/GestionPanier";
import {AlertPanierSetShow, CartCounterContext} from "./Home";
import {Col, Row} from "react-bootstrap";
import HttpService from "../Services/services/HttpService.ts";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
const totalPanier=(cart)=>{
    let tot=0
    if (cart){
        cart.forEach(ele=>{
            tot+=ele.quantity*ele.product.prix
        })
        return tot
    }
    else return 0
}
export default function Panier(){
    const [panier,setPanier]=useState([])
    const [total,setTotal]=useState(0)
    const [products,setProducts]=useState([])
    const setShow=useContext(AlertPanierSetShow)
    const {CartCounter,setCartCounter}=useContext(CartCounterContext)
    const navigate=useNavigate()
    const imgSrc="http://localhost:8080/products/images/"
    useEffect(()=>{
        const cart=JSON.parse(localStorage.getItem("client_cart"))
        setPanier(cart)
        setTotal(totalPanier(cart))
        HttpService.getProducts(`?size=4&projection=proj1`)
            .then(response => {
                setProducts(response.data._embedded.articles)
            })
    },[])

    return (
        <><Header/>
            {
        panier?.length>0?<div className="container d-sm-flex mb-5" style={{marginTop:"80px"}}>
        <div className="col-sm-7" style={{marginBottom:"100px"}}>
            <h3 className="card mb-0">Panier({panier.length})</h3>
            {
                panier.map((element,key)=>{
                    return(
                        <div className="card px-3" key={key}>
                            <div className="d-flex justify-content-between">
                            <div className="d-flex">
                            <img width={"200px"} height={"200px"} className="d-block" src={"http://localhost:8080/products/images/"+element.product.id+"/"+element.product.image[0].image}/>
                            <h4>{element.product.designation}</h4>
                            </div>
                                <h3 className="d-flex text-center align-items-center">{element.product.prix*element.quantity} dh</h3>
                            </div>
                            <div className="d-flex justify-content-between">
                                <h3 onClick={()=>{
                                    let [...cart]=panier
                                    cart=cart.filter(ele=>element.product.id!=ele.product.id)
                                    setPanier(cart)
                                    setTotal(totalPanier(cart))
                                    deleteProduct(element.product.id)
                                    setCartCounter(CartCounter-1)
                                }
                                } className="bg-warning rounded-1 justify-content-center text-white d-flex align-items-center  fas fa-trash" style={{height:"3rem",width:"3rem"}}></h3>
                                <div className="d-flex justify-content-between w-25">
                                    {
                                        element.quantity>1?<h4 onClick={()=>{
                                            const [...cart]=panier
                                            cart[key].quantity-=1
                                            setPanier(cart)
                                            setTotal(totalPanier(panier))
                                            decrementProduct(element.product.id)
                                        }
                                        } className="fas fa-minus bg-warning rounded-1 justify-content-center text-white d-flex align-items-center" style={{height:"3rem",width:"3rem"}}></h4>:
                                            <h4 className="fas fa-minus bg-warning bg-opacity-50 rounded-1 justify-content-center text-white d-flex align-items-center" style={{height:"3rem",width:"3rem"}}>

                                        </h4>
                                    }
                                    <h4 className="bg-warning rounded-1 justify-content-center text-white d-flex align-items-center" style={{height:"3rem",width:"3rem"}}>{element.quantity}</h4>
                                    <h4 onClick={()=>{
                                        const product=element.product
                                        const [...cart]=panier
                                        cart[key].quantity+=1
                                        setPanier(cart)
                                        setTotal(totalPanier(panier))
                                        ajouterPanier(product,setShow,setCartCounter)
                                    }
                                    } className="bg-warning rounded-1 justify-content-center text-white d-flex align-items-center fas fa-plus" style={{height:"3rem",width:"3rem"}}></h4>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
        <div className="mx-1 pt-2 position-sticky">
            <h1 className="bg-white mb-0">Résumé du panier</h1>
            <h3 className="bg-white mb-0 d-flex  align-items-center" style={{height:"5rem"}}>Total :{total} dh</h3>
            {
                total>1000?<h4 className="bg-white mt-0 mb-0">Commande éligible est à la livraison gratuite </h4>:
                    <div className="bg-white mt-0 mb-0 ">Livraison gratuite à partir de 1000 dh </div>
            }
            <h3 className="text-center bg-warning mt-0"><Link to={"/commander"} className="text-decoration-none">Commander</Link></h3>
        </div>
    </div>:<div className="d-flex justify-content-center align-items-center" style={{height:"74vh"}}><h1 >Votre panier est Vide ,<Link className={"text-decoration-none"} to={"/catalogue"}>consulter notre catalogue</Link></h1></div>
        }
    {
        products.length>0?
            <div className="container mt-5 mb-5 ">
                <h1 className="card-header bg-warning text-center">Vous pourriez aimer</h1>
                <Row className="flex-sm-row justify-content-sm-start mx-auto">
                    {
                        products.map((prod,key)=>{
                            return(
                                <>
                                    {
                                            <Col sm={3} className="card produit" key={key} onClick={()=>{
                                                navigate("/products/"+prod.id)
                                            }
                                            }>
                                                <img className="card-img d-block mt-3" src={imgSrc+prod.id+"/"+prod.image[0].image} alt=""/>
                                                <h3 className="text-center">{prod.designation}</h3>
                                                <h3 className={"text-center"}>{prod.prix} DH</h3>
                                                <button className="text-center btn btn-warning btn-lg">Ajouter <span className="fas fa-cart-shopping"></span></button>
                                            </Col>}</>)
                        })}
                </Row>
            </div>:""
    }
    <Footer/>
    </>)
}
export {totalPanier}