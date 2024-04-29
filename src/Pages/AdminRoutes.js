import React, {useEffect, useState} from "react";
import {Link, Navigate, Outlet, useLocation, useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import {Dropdown, Image} from "react-bootstrap";
import {serverAdress} from "./Constants";
import axios from "axios";
import HttpService from "../Services/services/HttpService.ts";
import {Menu, MenuItem, Sidebar, useProSidebar} from "react-pro-sidebar";
import {Provider} from "react-redux";
import {productStore} from "../Components/Admin/manage.products/productStore";
import {Logout} from "../Services/services/Authentication";
export default function AdminRoutes({},context){
    const [userDetails,setDetails]=useState()
    useEffect(()=>{
        if (context.authenticatedUser)
        axios.get(`${serverAdress}/utilisateurs/${context.authenticatedUser.username}`,{headers:HttpService.getAuthorizationToken()})
            .then(response=>{
                setDetails(response.data)
            })
    },[context.authenticatedUser])
    const location=useLocation()
    return context.authenticatedUser?.roles?.includes("ADMIN")?
        <div className="mx-0 vh-100 d-flex flex-column" style={{overflowY:"auto"}}>
            <div className="bg-white border-bottom d-flex align-items-center p-3 justify-content-between" style={{height:"15vh"}}>
                <h3>Dashboard</h3>
                <h3 className="d-flex align-content-center">
                    <Dropdown >
                        <Dropdown.Toggle variant={"outline-light"} className="bg-white">
                            <Image className="d-block" roundedCircle={true} width={"56px"} height={"56px"} src={"/1c.jpg"}/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item className="text-primary">ADMIN</Dropdown.Item>
                            <Dropdown.Item className="text-primary">{userDetails?.nom} {userDetails?.prenom}</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </h3>
            </div>
            <div className="d-flex overflow-hidden" style={{height:"85vh"}}>
                <div className="d-flex top-0 flex-column col-2 bg-secondary text-white h-100 ">
                    <MySideBar setUser={context.setUser}/>
                </div>
                <div className="col-10 h-100">
                    <Provider store={productStore}>
                        <Outlet/>
                    </Provider>

                </div>
            </div>
        </div>
        :<Navigate to={"/login?message=Vous devez vous connecter en tant qu'administrateur"} state={{from:location}} replace={true}/>
}
AdminRoutes.contextTypes={authenticatedUser:PropTypes.object,setUser:PropTypes.func}
const MySideBar=({setUser})=>{
    return <Sidebar width={"100%"} className="d-flex  h-100">
        <Menu>
            <MenuItem component={<Link to={""}/>}>
                <h3><span className={"fa-solid fa-home"}></span>Accueil</h3>
            </MenuItem>
            <MenuItem component={<Link className="nav-link" to={"produits"}/>}><h4>Produits</h4></MenuItem>
            <MenuItem component={<Link  className={"nav-link"} to="commandes"/>}><h4>Commandes</h4></MenuItem>
            <MenuItem component={<Link className="nav-link" to={"customers"}/>}><h4>Nos Clients</h4></MenuItem>
            <MenuItem onClick={()=>{
                Logout()
                setUser(null)
            }}>Logout <i className="fa-solid fa-right-from-bracket"></i></MenuItem>
        </Menu>
    </Sidebar>
}
