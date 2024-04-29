import Header from "../Components/Header";
import React, {useContext, useEffect, useState} from "react";
import Footer from "../Components/Footer";
import HttpService from "../Services/services/HttpService.ts";
import {Swiper, SwiperSlide} from "swiper/react";
import {ajouterPanier} from "../Services/services/GestionPanier";
import {useNavigate} from "react-router-dom";
import {AlertPanierSetShow, CartCounterContext} from "./Home";
import {FreeMode, Navigation, Pagination} from "swiper";
import {Image} from "react-bootstrap";

const Accueil=()=>{
    const [products,setProducts]=useState([])
    const navigate=useNavigate()
    const setShow=useContext(AlertPanierSetShow)
    const {CartCounter,setCartCounter}=useContext(CartCounterContext)
    const imgSrc="http://localhost:8080/products/images/"
    useEffect(()=>{
        HttpService.getProducts("?projection=proj1")
            .then(response=>{
                let results=response.data._embedded.articles
                results=results.filter(item=>item.oprix!=0).map(item=>{
                    item.reduction=Math.round(100*(item.oprix-item.prix)/item.oprix)
                    return item
                }).sort((a,b)=>{
                    if(a.reduction>b.reduction)
                        return 1
                    if (a.reduction<b.reduction)
                        return -1
                    if (a.reduction==b.reduction)
                        return 0
                }).reverse().slice(0,10)
                setProducts(results)
            })
            .catch(error=>{
            })
    },[])
    return(
        <>
            <Header/>
            <div style={{marginTop:"70px",boxSizing:"border-box"}}  className="p-5 mb-5 bg-white  container-fluid justify-content-center d-sm-flex banner-container">
                <Swiper className="col-sm-7 bg-white swiper-banner" modules={[Pagination]}  pagination={{clickable:true}}  style={{"--swiper-pagination-color": "orange"}}>
                    <SwiperSlide className="h-100 position-relative">
                        <div className={"position-absolute banner-message "} style={{top:"25%",left:"12%"}}>
                            <h1>Offre spéciale</h1>
                            <h4>9999 dh</h4>
                            <h4>Payable en tranche de 833.25dh/mois</h4>
                            <h4>pendant 12 mois</h4>
                            <h1 className="bg-warning col-6 rounded-5 mt-3 text-center">Acheter</h1>
                        </div>
                        <img className="w-100 h-100 rounded " src={"images/mybanner1.jpg"}/>
                    </SwiperSlide>
                    <SwiperSlide className="h-100 position-relative">
                        <div className={"position-absolute banner-message"} style={{top:"25%",left:"12%"}}>
                            <h1>Ipad s13+ pro</h1>
                            <h4>9999 dh</h4>
                            <h4>Payable en tranche de 833.25dh/mois</h4>
                            <h4>pendant 12 mois</h4>
                            <h1 className="bg-light col-6 rounded-5 mt-3 text-center">Acheter</h1>
                        </div>

                        <img className="w-100 rounded h-100" src={"images/main-banner-1.jpg"}/>
                    </SwiperSlide>
                </Swiper>
                <div className="second-banner col-sm-4 d-flex flex-sm-column justify-content-between h-100" style={{marginRight:"20px"}}>
                    <div className="card position-relative new-arrival" style={{height:"48%"}}>
                        <div className={"position-absolute banner-message "} style={{top:"25%",left:"12%"}}>
                            <h3 className="text-danger">New arrival</h3>
                            <h1>AirPods Max </h1>
                            <h4>A partir de 9999 dh</h4>
                            <h4>ou 833.25dh/mois</h4>
                            <h4>pendant 12 mois</h4>
                        </div>
                        <Image fluid={true} src={"images/catbanner-04.jpg"} className="h-100"/>
                    </div>
                    <div className="card position-relative off-20" style={{height:"48%"}}>
                        <div className={"position-absolute banner-message"} style={{top:"25%",left:"12%"}}>
                            <h3 className="text-danger">20% off</h3>
                            <h1>Smartwatch 7</h1>
                        </div>
                        <Image className="h-100" fluid={true} src={"images/catbanner-02.jpg"}/>
                    </div>
                </div>
            </div>
            <div className="container-fluid  d-flex justify-content-evenly">
                <div className="d-flex align-items-center">
                    <img src={"images/service.png"} className="d-block"/>
                    <div className="" style={{marginLeft:"10px"}}>
                        <h3>Livraison gratuite </h3>
                        <h5>A partir de 1500 dh</h5>
                        <h5>d'articles commandés </h5>
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <img src={"images/service-05.png"} className="d-block"/>
                    <div className="" style={{marginLeft:"10px"}}>
                        <h3>Paiement sécurisé </h3>
                        <h5>Vous pourriez payer</h5>
                        <h5>par carte bancaire/paypal</h5>
                        <h5>ou à la livraison</h5>
                    </div>

                </div>
                <div className="d-flex align-items-center">
                    <img src={"images/service-03.png"} className="d-block"/>
                    <div className="" style={{marginLeft:"10px"}}>
                        <h3>Service clientèle </h3>
                        <h5>Disponible 24/7</h5>
                    </div>

                </div>
            </div>
            <br/>

            <h3 className="mt-3 mb-0 bg-warning container p-0">En promotion</h3>
            <div className="container mt-0 p-0 mb-5">
                <Swiper breakpoints={{
                    640:{slidesPerView:1},
                    768:{slidesPerView:2,
                        spaceBetween:15},
                    1024:{slidesPerView:3,spaceBetween:30}
                }
                } loop={true} slidesPerView={1} spaceBetween={30} navigation={true} modules={[Navigation]} style={{
                    "--swiper-navigation-color": "orange",
                    "--swiper-pagination-color": "orange",
                }}>
                    {
                        products.map((product,key)=>{
                            return(
                                <SwiperSlide className="card produit" key={key}>
                                    <div>
                                        <h4 className="position-relative bg-warning text-warning bg-opacity-10 " style={{width:"3.5rem",left:"1.5rem",top:"1.5rem"}}>-{product.reduction}%</h4>
                                        <img onClick={()=>{navigate("/products/"+product.id)}} className="card-img d-block mt-3" src={imgSrc+product.id+"/"+product.image[0].image} alt=""/>
                                    </div>
                                    <h3 className="text-center">{product.designation}</h3>
                                    <h3 className={"text-center"}>{product.prix} DH <span className="text-decoration-line-through text-secondary">{product.oprix} DH</span></h3>
                                    <button className="text-center btn btn-warning btn-lg" onClick={()=>{ajouterPanier(product,setShow,setCartCounter)
                                    }}>Ajouter <span className="fas fa-cart-shopping"></span></button>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>
            <Footer/>
        </>
    )
}
export default Accueil