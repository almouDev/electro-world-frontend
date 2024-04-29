import {Link, useLocation, useNavigate} from "react-router-dom"
import {Field, Form} from "../Pages/Form"
import axios from "axios";
import {UrlformEncoded} from "../utilities/UrlformEncoded";
import React, {useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {CartCounterContext} from "../Pages/Home";
import HttpService from "../Services/services/HttpService.ts";
import {Logout} from "../Services/services/Authentication";
import {Dropdown, OverlayTrigger, Popover} from "react-bootstrap";
import {serverAdress} from "../Pages/Constants";
export default function Header({changeProduct,changeCategorie,children},context){
    const [categories,setCategories]=useState()
    const togglerValues=["menu","search-form","login-form"]
    const [navigate,location]=[useNavigate(),useLocation()]
    const [searchResult,setSearchResult]=useState([])
    const [search,setSearch]=useState("")
    const [authenticatedUser,setUser]=[context.authenticatedUser,context.setUser]
    const {CartCounter,setCartCounter}=useContext(CartCounterContext)
    const toogleMenu=(id)=>{
        const toogle=document.querySelector("."+id)
        toogle.classList.toggle("active")
        togglerValues.map(value=>{
            if (value!==id){
                const toRemove=document.querySelector("."+value)
                toRemove.classList.remove("active")
            }
        })
    }
    useEffect(()=>{
        axios.get(serverAdress+"/categories")
            .then(resp=>{
                setCategories(resp.data._embedded.categories)
            })
    },[])
    return (
        <>
        <header className=" d-flex align-items-center container-fluid header mb-4 position-fixed top-0  bg-white" style={{fontSize:"2rem"}}>
            <div><span className="navbar-brand">ALMOU@SHOP</span></div>
            <nav className="navbar navbar-expand-sm mx-sm-5 justify-content-sm-evenly menu" id="menu">
                <ul className="navbar-nav">
                    <li className="nav-item"><Link className="nav-link text-dark" to="/" >Accueil</Link></li>
                    <li className="nav-item"><Link className="nav-link text-dark" to="/catalogue" >Produits</Link></li>
                    <li className="nav-item">
                        <Dropdown>
                            <Dropdown.Toggle variant="success" as={"P"} className={"bg-white text-dark nav-link"} id="dropdown-basic">
                                Catégories
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="col-sm-5">
                                {
                                    categories?.map((cate,key)=>{
                                        return <>
                                            <p key={key} className="text-dark"><Link onClick={
                                                ()=>{
                                                    if (location.pathname.startsWith("/catalogue"))
                                                        changeCategorie("/search/categorie?nom="+cate.categorieName+"&size=8")
                                                }
                                            } key={key} to={"/catalogue?categorie="+cate.categorieName} className="nav-link">{cate.categorieName}</Link></p>
                                        </>
                                    })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                    <li className="nav-item"><Link className="nav-link text-dark">Contact</Link></li>
                </ul>
            </nav>
            <div className="icons d-flex m-1">
                <div className="d-sm-none " onClick={()=>{toogleMenu("menu")}}><span  className="fas fa-bars"></span></div>
                <div onClick={()=>{toogleMenu("search-form")}}><span className="fas fa-search"></span></div>
                <div onClick={()=>{toogleMenu("login-form")}}><span className="fas fa-user"></span></div>
                <div><Link to="/panier" className="fas  fa-shopping-cart nav-link"><span className="text-danger">{CartCounter>0?CartCounter:""}</span></Link></div>
            </div>
            <div className="search-form position-absolute ">
                <form className="align-content-center d-flex align-items-center mb-2 bg-white" style={{height:"4.5rem"}}>
                    <label className="form-label  fas fa-search border-0"></label>
                    <input className="form-control-plaintext h-100 w-100 border-white" type="search" onChange={event=>{
                        const value=event.target.value
                        if (value)
                            HttpService.getProducts(`/search/designation?titre=${value}&projection=proj1`)
                                .then(result=>{
                                    setSearchResult(result.data._embedded.articles)
                                })
                        setSearch(value)
                    }} />
                </form>
                {
                    search?<>
                        {
                            searchResult?<ul className="list-group">
                                {
                                    searchResult.map((product,key)=>{
                                        return (
                                            <li className="list-group-item" key={key}><Link onClick={()=>{
                                                if (location.pathname.startsWith("/products/"))
                                                    changeProduct(product)
                                            }} className="text-decoration-none" to={"/products/"+product.id}>{product.designation}</Link></li>)
                                    })
                                }
                            </ul>:<div className="bg-white text-danger">Aucun produit ne correspond à votre recherche</div>
                        }
                    </>:""
                }
            </div>
            {authenticatedUser?<div className="login-form border-warning card text-center  position-absolute"><div>{authenticatedUser.username}</div>
                <p><button className="btn btn-danger" onClick={()=>{
                    Logout()
                    setUser(null)
                }}>Se déconnecter</button></p>
            </div>:
                <Form inputs={{}} class="login-form  position-absolute" onSubmit={({inputs,errors})=>{
                    const headers=new Headers()
                    headers.set("Content-Type","application/x-www-form-urlencoded")
                    axios.post("http://localhost:8080/login",UrlformEncoded(inputs),{headers:headers})
                        .then(response=>{
                            const tokens=response.data
                            const accessToken=tokens.access_token
                            const payload=JSON.parse(atob(accessToken.split(".")[1]))
                            setUser({username:payload.sub,roles:payload.roles})
                            localStorage.setItem("access_token",tokens.access_token)
                            localStorage.setItem("refresh_token",tokens.refresh_token)
                            navigate(location.pathname)
                        })
                }
                }>
                    {
                        ()=>{
                            return(
                                <div className="card ">
                                    <div className="card-header text-center">Connexion</div>
                                    <div className="card-body d-flex row m-3 p-3 justify-content-between">
                                        <div className="m-2"><Field name="username" type="text" className="form-control " style={{height:"4rem"}} placeholder="your email"/></div>
                                        <div className="m-2"><Field name="password" type="password" className="form-control " style={{height:"4rem"}} placeholder="password"/></div>
                                        <div>Mot de passe oublié ?<Link to={"/reset_password"} className="text-decoration-none text-warning">cliquer ici</Link> </div>
                                        <div>Créer un compte <Link to={"/signup"} className="text-decoration-none text-warning">clicquer ici </Link></div>
                                    </div>
                                    <div className="card-footer text-center"><button className="btn btn-warning">Connexion</button></div>
                                </div>
                            )
                        }
                    }
                </Form>
            }
            </header>
        </>
    ) 
}
Header.contextTypes={
    authenticatedUser:PropTypes.object,setUser:PropTypes.func,CartCounterContext:PropTypes.object
}