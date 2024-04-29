import React, {useContext, useEffect, useState} from "react";
import Footer from "../Components/Footer";
import HttpService from "../Services/services/HttpService.ts";
import {Container,Row,Col} from "react-bootstrap";
import {Link, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {AlertPanierSetShow, CartCounterContext} from "./Home";
import {ajouterPanier} from "../Services/services/GestionPanier";
import Header from "../Components/Header";
const Products=()=>{
    const categorie=useSearchParams()[0].get("categorie")
    const imgSrc="http://localhost:8080/products/images/"
    const [products,setProducts]=useState([])
    const [resource,setResource]=useState(categorie?"/search/categorie?nom="+categorie+"&size=8":"?size=8&")
    const [pages,setPages]=useState({currentPage:0})
    const navigate=useNavigate()
    const setShow=useContext(AlertPanierSetShow)
    const {CartCounter,setCartCounter}=useContext(CartCounterContext)
    const goToPage=(ele)=>{
        setResource("?size=8&page="+ele)
        setPages(prevState => {
            prevState.currentPage=ele
            return prevState})
    }
    useEffect(()=>{
        HttpService.getProducts(resource+"&projection=proj1")
            .then(response=>{
                let i=0
                const results=response.data._embedded.articles
                setProducts(results)
                const totalPages=response.data.page?.totalPages||0
                const {...newPage}=pages
                newPage.numberOfpages=totalPages
                newPage.totalElements=response.data.page?.totalElements||0
                setPages(newPage)
            })
    },[resource])
    return(
        <>
            <Header changeCategorie={setResource}/>
            <Container className="mb-5">
                <Row className="flex-sm-row justify-content-sm-start mx-auto" style={{marginTop:"80px"}}>
                    {
                        products.map((product,key)=>{
                            return(
                                <Col sm={3} className="card produit" key={key}>
                                    <div>
                                        {product.oprix!=0?
                                        <h4 className="position-relative bg-warning text-warning bg-opacity-10 " style={{width:"3.5rem",top:"1.5rem",left:"1.5rem"}}>-{Math.round(100*(product.oprix-product.prix)/product.oprix)}%</h4>
                                        :<h4 style={{height:"2rem"}}> </h4>
                                        }
                                    <img onClick={()=>{navigate("/products/"+product.id)}} className="card-img d-block mt-3" src={imgSrc+product.id+"/"+product.image[0].image} alt=""/>
                                    </div>
                                    <h3 className="text-center">{product.designation}</h3>
                                    <h3 className={"text-center"}>{product.prix} DH {product.oprix!=0?<span className="text-decoration-line-through text-secondary">{product.oprix} DH</span>:""}</h3>
                                    <button className="text-center btn btn-warning btn-lg" onClick={()=>{ajouterPanier(product,setShow,setCartCounter)
                                    }}>Ajouter <span className="fas fa-cart-shopping"></span></button>
                                </Col>
                            )
                        })
                    }
                </Row>
                {pages.totalElements>8?<div className="row  mt-5 ">
                    <ul className="pagination mx-auto  justify-content-center pagination-lg">
                        <li className={"page-item "+(pages.currentPage>0?"active":"")}>{pages.currentPage>0?<Link className={"page-link"} onClick={()=>{goToPage(pages.currentPage-1)}}>Précédent</Link>:<span className={"page-link"}>Précedent</span>}</li>
                        {Array(pages.numberOfpages).fill(0).map((e,ele)=>{
                            return(
                                <li className={"page-item "+(ele==pages.currentPage?"active":"")} key={ele}>
                                    <Link className={"page-link text-warning "} onClick={(event)=>{goToPage(ele)}}>{ele+1}</Link>
                                </li>
                            )
                        })}

                        <li className={"page-item "+(pages.currentPage<pages.numberOfpages-1?"active":"")}>{pages.currentPage<pages.numberOfpages-1?<Link className={"page-link"} onClick={()=>{goToPage(pages.currentPage+1)}}>Suivant</Link>:<span className={"page-link"}>Suivant</span>}</li>
                    </ul>
                </div>:""}
            </Container>
            <div className="mt-5">
            <Footer/>
            </div>
        </>
    )
}
export default Products;