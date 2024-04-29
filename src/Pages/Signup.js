import React, {useReducer, useState} from "react"
import {Form,Field} from "./Form"
import * as Yup from "yup"
import axios from "axios";
import {Navigate, useNavigate} from "react-router-dom";
import {Alert} from "react-bootstrap";
export default function Signup(){
    const navigate=useNavigate()
    const [state,setState]=useReducer((prevState,{payload})=>{
        return {...prevState,...payload}
    },{alert:"",variant:"success",showAlert:false,isSubmittable:true})

    function validateField1({errors,inputs}){
        if(inputs.pwdConfirm!=inputs.password)
        errors.pwdConfirm="Ca ne correspond pas"
        else
        errors.pwdConfirm=undefined
        return errors
}
    const validationSchema=Yup.object().shape({
        email:Yup.string().email("Email invalide").required("L'email ne doit etre vide"),
        password:Yup.string().required("Veillez saisir un mot de pass").min(10,"Tres court"),
        nom:Yup.string().required("Ce champ est requis"),
        prenom:Yup.string().required("Ce champ est requis"),
        files:Yup.object().shape({
            extensions:Yup.mixed().oneOf(["png","jpg","jpeg","webp"]),
            size:Yup.number().max(30*1024)
        })
    })
    return(
        <>
            {
                state.showAlert?
                    <Alert onClose={()=>{setState({payload:{showAlert:false}})}} dismissible={true} className={`text-center text-white bg-${state.variant}`} variant={state.variant}><h3>{state.alert}</h3></Alert>:""
            }
        <div className="col-md-6 mx-auto mt-3 d-flex flex-column justify-content-center vh-100">
        <div className="card-header bg-warning"><h3 className="text-center">Création de compte</h3></div>
        <div className="card">
            <Form inputs={{email:"",password:"",nom:"",prenom:"",pwdConfirm:"",adress:""}} validationSchema={validationSchema}
            onSubmit={({inputs,errors})=>{
                if(!inputs.password==inputs.pwdConfirm){
                    setState({payload:{isSubmittable:true}})
                    errors.pwdConfirm="Ca ne correspond pas"
                }
                for(let key of Object.keys(errors)){
                    if(errors[key]){
                        setState({payload:{isSubmittable: true}})
                        return errors
                    }
                    }
                axios.post("http://localhost:8080/signup",inputs)
                    .then(res=>{
                        setState({payload:{isSubmittable:false}})
                        setState({payload:{showAlert:true,alert:"Votre compte a été creer avec success,vous serez redirige dans la page de connexion dans 5s",variant:"success"}})
                        const timeout=setTimeout(()=>{clearTimeout(timeout)
                        navigate("/login")
                        },10000)
                    })
                    .catch(errors=>{
                        setState({payload:{showAlert:true,isSubmittable:true,variant:"danger",alert:errors.response.data}})

                    })
                return errors
            }}
            >
                {({errors,touched,validateField})=>{
                    return(
                        <>
                        <label className="form-label">Email:<span className="text-danger ">{touched.email&&errors.email}</span></label>
                        <Field name="email" className="form-control"  placeholder="Votre adress mail"/>
                        <label className="form-label">Nom:<span className="text-danger "> {touched.nom&&errors.nom}</span></label>
                        <Field type="text" className="form-control" name="nom"  placeholder="Votre nom"/>
                        <label className="form-label">Prenom: <span className="text-danger "> {touched.prenom&&errors.prenom}</span></label>
                        <Field type="text"  name="prenom" className="form-control"  placeholder="Votre prenom"/>
                        <label className="form-label">Mot de pass:<span className="text-danger "> {touched.password&&errors.password}</span></label>
                        <Field type="password"  name="password" className="form-control"  placeholder="Votre mot de pass"/>
                        <label className="form-label">Confirmation de mot de pass:<span className="text-danger">{touched.pwdConfirm&&errors.pwdConfirm}</span></label>
                        <Field type="password"  name="pwdConfirm" className="form-control" onChange={(e)=>{validateField(e,validateField1)}}  placeholder="Saisissez à nouvesu le mot de pass" />
                        <label className="form-label">Adresse client:</label>
                        <Field cols="30" rows="3" className="form-control" name="adress"  placeholder="Votre adresse" component="textarea"/>
                        <button disabled={!state.isSubmittable} className="btn d-block mx-auto mb-3 mt-3 btn-warning " type="submit">Envoyer</button>
                        </>
                        )
                }}
            </Form>
        </div>
        </div>
            </>
    )
}