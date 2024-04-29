import axios, {AxiosHeaders} from "axios";
import {getAccessToken} from "./Authentication";
export default class HttpService{
    static  getAuthorizationToken(){
        const access_token=getAccessToken()
        const headers=new AxiosHeaders()
        headers.set("Authorization","Bearer "+access_token)
        headers.set("Content-Type","multipart/form-data")
        return headers;
    }
    static serverUrl="http://localhost:8080/"
    public static getProducts(resource?){
        const res=resource||"";
        return axios.get(this.serverUrl+"articles"+res)
    }
    public static  getProductByID(id){
        return axios.get(this.serverUrl+"produits/"+id)
    }
    public static addProduct(product){
        return axios.post(this.serverUrl+"ajout_produit",product,{headers:this.getAuthorizationToken()})
    }
    public static addCategorie(categorie,headers){
        return axios.post(this.serverUrl+"categories",+categorie,{headers:this.getAuthorizationToken()})
    }
    public static  deleteProduct(id){
        return axios.delete(this.serverUrl+"articles/"+id,{headers:this.getAuthorizationToken()})
    }
    public static editProduct(product){
        return axios.patch(this.serverUrl+"articles/"+product.id,product,{headers:this.getAuthorizationToken().set("Content-Type","Application/json")})
    }
}