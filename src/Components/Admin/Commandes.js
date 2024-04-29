import {Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import HttpService from "../../Services/services/HttpService.ts";
import axios from "axios";
import {serverAdress} from "../../Pages/Constants";

const  getTotalCommande=(commande)=>{
    let total=0
    commande.articles.forEach(element=>{
        total+=element.article.prix*element.quantity
    })
}
const Commandes=()=>{
    const [commandes,setCommandes]=useState([])
    useEffect(()=>{
        axios.get(`${serverAdress}/orders`,{headers:HttpService.getAuthorizationToken()})
            .then(response=>{
                setCommandes(response.data)
            })
    },[])
    return(<div className="container mt-3 h-100 " style={{overflowY:"auto"}}>
        <Table className="bg-white" bordered={true}>
            <thead>
            <tr>
                <th>Numéro de la commande</th>
                <th>Date de la commande</th>
                <th>Client</th>
                <th>Articles commandes</th>
                <th>Total</th>
                <th>Status</th>
            </tr>
            </thead>
            {
                commandes?
                    <tbody>
                    {
                    commandes.map((cmd,key)=>{
                        return <tr key={key}>
                        <td>{cmd.id}</td>
                            <td>{cmd.date_commande}</td>
                        <td>{cmd.user.email}</td>
                        <td aria-colspan={cmd.articles.length}>

                            {cmd.articles?.map((ar,num)=>{
                                return <p key={num}>{ar.article.designation}({ar.quantity} unités) {ar.article.prix}DH</p>
                            })}
                        </td>
                            <td>{cmd.total} DH</td>
                        <td><p>{cmd.shipped?"Commande livree":"Non livree"}</p></td>
                        </tr>})
                    }
                    </tbody>: <tbody className="text-center text-danger"><tr><td className="text-center" aria-colspan={"4"}>Aucune commandes trouves</td></tr></tbody>
            }
        </Table>
    </div>)
}
export {Commandes}