import {Field, Form} from "./Form";
import HttpService from "../Services/services/HttpService.ts";
import {useState} from "react";
import {Alert} from "react-bootstrap";

export default function AddProduct(props){
    const [showAlert,setShowAlert]=useState(false)
    const [variant,setVariant]=useState("success")
    const [message,setMessage]=useState("Produit ajouté avec succés")
    return(
        <div className="container m-3">
            {showAlert?
            <Alert className="col-8 mx-5"  dismissible={true} variant={variant} onClose={()=>{setShowAlert(false)}}>{message}</Alert>:""
            }
        <div className="card col-8 mx-5">
            <div className={"col-10 mx-auto"}>
            <Form id={"add_product_form"} enctype={"multipart/form-data"} className="card-body" inputs={{}} onSubmit={({inputs,errors})=>{
                const form=new FormData()
                for (let key in inputs){
                    if (key!="files")
                        form.append(key,inputs[key])
                    else {
                        for (let i=0;i<inputs[key].length;i++)
                            form.append(key,inputs[key][i])
                    }
                }
                HttpService.addProduct(form)
                    .then(response=>{
                        setShowAlert(true)
                        const frm=document.querySelector("#add_product_form")
                        frm.reset()
                    })
                    .catch(errors=>{
                        setShowAlert(true)
                        setVariant("danger")
                        setMessage(errors.response.data)
                    })
            }}>
                {()=>{

                    return(
                        <>
                            <div className={"mt-3"}><label className="form-label"> Designation du produit:</label>
                                <Field name="designation" type={"text"} className="form-control" required/>
                            </div>
                            <div className={"mt-3"}>
                                <label className="form-label">Prix du produit</label>
                                <Field name={"prix"} className={"form-control"} type={"number"}/>
                            </div>
                            <div className={"mt-3"}>
                                <label className="form-label">Quantité en stock</label>
                                <Field name={"stock"} className={"form-control"} type={"number"}/>
                            </div>
                            <div className={"mt-3"}>
                                <label className="form-label">Catégorie du produit</label>
                                <Field name={"categorie"} className="form-control"/>
                            </div>
                            <div className={"mt-3"}>
                                <label className={"form-label"}>Caractéristiques de l'article</label>
                                <Field name={"caracteristiques"} className={"form-control"} component={"textarea"}/>

                            </div>
                            <div className={"mt-3 mb-3"}>
                                <label className="form-label">Telecharger des images pour ce produit</label>
                                <Field name="files" type={"file"} className="form-control" multiple/>
                            </div>
                            <button type="submit" className={"btn btn-warning"}>Sumettre</button>
                        </>
                    )
                }
                }
            </Form>
            </div>
        </div>
        </div>)
}