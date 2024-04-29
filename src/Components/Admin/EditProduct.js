import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";
import HttpService from "../../Services/services/HttpService.ts";
export const EditProduct=({show,onHide,prod,submit})=>{
    const [product,setProduct]=useState({})
    useEffect(()=>{setProduct(prod)},[show])
    return (
        <>
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Mise à jour du produit dont la désignation est {prod.designation} </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form name="editProduct" onSubmit={(event)=>{
                        event.preventDefault()
                    }}>
                        <label className={"form-label"}>Nouvelle désignation:</label>
                        <input className="form-control"  onChange={(event)=>{
                            const {...article}=product
                            article.designation=event.target.value
                            setProduct(article)
                        }} value={product.designation}/>
                        <label className={"form-label"}>Nouveau prix:</label>
                        <input className={"form-control"} type={"number"} onChange={(event)=>{
                            const {...article}=product
                            article.prix=event.target.value
                            setProduct(article)
                        }} value={product.prix}/>
                        <label className={"form-label"}>Quantité en stock:</label>
                        <input className={"form-control"} type={"number"} onChange={(event)=>{
                            const {...article}=product
                            article.stock=event.target.value
                            setProduct(article)
                        }} value={product.stock}/>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" aria-label={"negative"} onClick={onHide}>
                        Annuler
                    </Button>
                    <Button variant="primary" aria-label={"positive"} onClick={()=>{
                        submit(product)
                    }}>
                        Confirmer
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}