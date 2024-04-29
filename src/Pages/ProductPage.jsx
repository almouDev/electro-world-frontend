import {useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {SwiperSlide,Swiper} from "swiper/react";
import HttpService from "../Services/services/HttpService.ts";
import {FreeMode, Navigation, Thumbs} from "swiper";
import {Alert, Col, Row} from "react-bootstrap";
import {ajouterPanier} from "../Services/services/GestionPanier";
import {AlertPanierSetShow, CartCounterContext} from "./Home";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import {images} from "./Constants";
const ProductPage=()=>{
    const setShow=useContext(AlertPanierSetShow)
    const {CartCounter,setCartCounter}=useContext(CartCounterContext)
    const [product,setProduct]=useState()
    const productId=useParams().productId
    const navigate=useNavigate()
    const [thumbsSwiper,setThumbs]=useState(null)
    const [products,setProducts]=useState([])
    useEffect(()=>{
        HttpService.getProductByID(productId)
            .then(response=> {
                const result = response.data
                setProduct(result)
                return result
            })
            .then(result=>{
                HttpService.getProducts("/search/categorie?nom=" + result.categorie.categorieName + "&size=5&projection=proj1")
                    .then(response => {
                        setProducts(response.data._embedded.articles)
                    })
            })
    },[])

    return(
        <>
            <Header changeProduct={setProduct}/>
            {
        product?
        <div className="d-sm-flex flex-sm-row container "  style={{marginTop:"80px"}} >
            <div className="card  col-sm-4  p-3 " style={{height:"40rem"}}>
                <h3 className={"text-warning text-center"} >{product.designation} /{product.prix} DH</h3>
                <Swiper style={{
                    "--swiper-navigation-color": "orange",
                    "--swiper-pagination-color": "orange",
                    height:"85%"
                }} modules={[Thumbs,FreeMode,Navigation]} thumbs={{swiper:thumbsSwiper}} navigation={true}   className="w-100">
                    {
                        product.image.map(image=>{
                            return(
                                <SwiperSlide className={"h-100 w-100"}>
                                    <img className="d-block h-100 w-100" src={`${images}${product.id}/${image.image}`}/>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
                {
                    product.image.length>1?
                <Swiper style={{height:"15%"}} spaceBetween={5} onSwiper={setThumbs} slidesPerView={product.image.length} modules={[Thumbs,Navigation,FreeMode]} freeMode={true} watchSlidesProgress={true}  navigation={true} className="mt-3 w-100">
                    {
                        product.image.map((image,number)=>{
                            return(
                                <SwiperSlide className={"h-100"}>
                                    <img className="d-block h-100 w-100" src={`${images}${product.id}/${image.image}`}/>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>:""}
            </div>
            <div className="card col-sm-3">
                <h3 className="text-center">Caractéristiques du produit</h3>
                <div className="card-body">
                    <ul>
                        {
                            product.caracteristiques.split("\n").map((car,index)=>{
                                return <li key={index}><b>{car}</b></li>
                            })
                        }
                    </ul>
                </div>
                </div>
            </div>:""
            }
            <div className="container">
                <div className="col-sm-7 mb-5 bg-warning d-flex justify-content-between p-2 " onClick={()=>{
                    ajouterPanier(product,setShow,setCartCounter)
                    }}>
                    <h3>Ajouter</h3>
                    <h3 className="fas fa-shopping-cart"></h3>
                </div>
            </div>
            {
                products.length>0?
                    <div className="container mt-5 mb-5 ">
                        <h1 className="card-header bg-warning text-center">De la même catégorie</h1>
                        <Row className="flex-sm-row justify-content-sm-start mx-auto">
                            {
                                products.map((prod,key)=>{
                                    return(
                                        <>
                                            {
                                                prod.id!=product.id?
                                        <Col sm={3} className="card produit" key={key} onClick={()=>{
                                            navigate("/products/"+prod.id)
                                            setProduct(prod)
                                        }
                                        }>
                                            <img className="card-img d-block mt-3" src={images+prod.id+"/"+prod.image[0].image} alt=""/>
                                            <h3 className="text-center">{prod.designation}</h3>
                                            <h3 className={"text-center"}>{prod.prix} DH</h3>
                                            <button className="text-center btn btn-warning btn-lg">Ajouter <span className="fas fa-cart-shopping"></span></button>
                                        </Col>:""}</>)
                        })}
                        </Row>
                    </div>:""
            }
            <Footer/>
            </>
    )
}
export default ProductPage