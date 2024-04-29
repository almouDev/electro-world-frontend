import React, {useContext, useEffect, useState} from "react"
import {Form,Field} from "./Form"
import axios from "axios";
import {UrlformEncoded} from "../utilities/UrlformEncoded";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import PropTypes from "prop-types";
import {decodeJwt} from "jose";
import {Alert} from "react-bootstrap";
const Login=({},context)=>{
    const [navigate,location]=[useNavigate(),useLocation()]
    const from=location.state?.from?.pathname||"/"
    const setUser=context.setUser
    const [message,setMessage]=useState(useSearchParams()[0].get("message"))
    const [show,setShow]=useState(false)
    useEffect(()=>{
        setShow(message!=null)
    },[message])
    return(
        <div className="d-flex justify-content-center align-items-sm-center flex-column mt-3 container" style={{height:"95vh"}}>
            {show?<Alert className="text-center   text-danger col-sm-5" variant={"danger"} dismissible onClose={()=>{setShow(false)}}>{message}</Alert>:""}
            <h3 className="text-center mb-0 bg-warning col-sm-5">Authentification</h3>
        <Form style={{height:"250px"}} class="card d-flex   justify-content-center  col-sm-5" inputs={{username:"",password:"",}} onSubmit={({inputs})=>{
            const headers=new Headers()
            headers.set("Content-Type","application/x-www-form-urlencoded")
            axios.post("http://localhost:8080/login",UrlformEncoded(inputs),{headers:headers})
                .then(response=>{
                    const tokens=response.data
                    localStorage.setItem("access_token",tokens.access_token)
                    const payload=decodeJwt(tokens.access_token)
                    setUser({username:payload.sub,roles:payload.roles})
                    localStorage.setItem("refresh_token",tokens.refresh_token)
                    navigate(from)
                })
                .catch(error=>{
                    setMessage("Les indentifiants saisis sont incorrects")
                })
            }
        }>
            {({})=>{
                return(
                    <>
                        <div className="mb-3 mt-0 mx-auto col-10">
                            <label className="form-label ">Nom d'utilisateur:</label>
                            <Field type="text" className="form-control " name="username" style={{height:"4rem"}}/>
                        </div>
                        <div className="mt-3 mx-auto col-10">
                            <label className="form-label">Mot de passe:</label>
                            <Field  type="password" name="password" className="form-control"style={{height:"4rem"}}/>
                        </div>
                        <div className="text-center mt-5">
                            <button className="btn bg-warning" type="submit">Se connecter</button>
                        </div>
                    </>
            )
        }}
        </Form>
        </div> 

    )
}
Login.contextTypes={
    setUser:PropTypes.func
}
export default Login