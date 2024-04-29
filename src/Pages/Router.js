import React from "react"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import NotFound from "./NotFound"
import Login from "./Login"
import Signup from "./Signup"
import Layout from "./Layout"
import {Home} from "./Home"
import AdminRoutes from "./AdminRoutes";
import AddProduct from "./AddProduct";
import {AuthenticatedUser} from "../Services/services/Authentication";
import Products from "./Products";
import ProductPage from "./ProductPage";
import Panier from "./Panier";
import Accueil from "./Accueil";
import {Commande} from "./Commande";
import {Produits} from "../Components/Admin/Produits";
import {Commandes} from "../Components/Admin/Commandes";
import {Customers} from "../Components/Admin/Clients";
import {ProSidebarProvider} from "react-pro-sidebar";
import {Dashboard} from "../Components/Admin/Dashboard";
import Welcome from "./Welcome";
class  Router extends React.Component{
  constructor(props) {
    super(props);
    this.state={authenticatedUser:null}
  }
  componentDidMount() {
    const user=AuthenticatedUser()
    this.setState({authenticatedUser:user})
  }
    render(){
    return (
      <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route path='*' element={<NotFound/>} />
          <Route path='login' element={<Login/>}/>
          <Route path='signup' element={<Signup/>}/>
          <Route path={""} element={<Home/>}>
            <Route element={<Accueil/>} index/>
            <Route element={<Products/>} path={"catalogue"}/>
            <Route element={<ProductPage/>} path="products/:productId"/>
            <Route element={<Panier/>} path={"panier"}/>
            <Route element={<Commande/>} path={"commander"}/>
          </Route>
          <Route path="admin/" element={
            <ProSidebarProvider><AdminRoutes/></ProSidebarProvider>}>
            <Route path="produits" element={<Produits/>}/>
            <Route path="ajout_produit" element={<AddProduct/>}/>
            <Route path={"commandes"} element={<Commandes/>}/>
            <Route path={"customers"} element={<Customers/>}/>
            <Route index element={<Dashboard/>} path=""/>
          </Route>
        </Route>
      </Routes>
      </BrowserRouter>
      </>
  
      
    )
  }
  }

  export {Router}