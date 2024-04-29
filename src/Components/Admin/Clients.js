import {Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {serverAdress} from "../../Pages/Constants";
import HttpService from "../../Services/services/HttpService.ts";

export function Customers(){
    const [users,setUsers]=useState([])
    useEffect(()=>{
        axios.get(`${serverAdress}/users`,{headers:HttpService.getAuthorizationToken()})
            .then(response=>{
                setUsers(response.data._embedded.appUsers)
            })
    },[])
    return(<div className="mx-auto  container mb-3 h-100 col-10 mt-3" style={{overflowY:"auto",scrollbarWidth:"100px"}}>
        <Table className="bg-white" striped={true} bordered={true}>
            <thead>
            <tr>
                <td>Email</td>
                <td>Phone number</td>
                <td>Addresse</td>
                <td>#</td>
            </tr>
            </thead>
            <tbody>
            {
                users?.map(user=>{
                    return(
                        <tr key={user.user_id}>
                            <td>
                                {user.email}
                            </td>
                            <td>{user.phone}</td>
                            <td>{user.adress}</td>
                            <td><p ><a  onClick={()=>{
                                axios.delete(`${serverAdress}/users/${user.user_id}`,{headers:HttpService.getAuthorizationToken()})
                                    .then(response=>{
                                    })
                            }} className="nav-link"><i className="text-danger fa-solid fa-trash"></i></a></p></td>
                        </tr>
                    )
                })
            }
            </tbody>
        </Table>
    </div>)
}