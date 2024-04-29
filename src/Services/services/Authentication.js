import {decodeJwt} from "jose";
import axios, {AxiosHeaders} from "axios";
import {serverAdress} from "../../Pages/Constants";
export function AuthenticatedUser() {
    const access_token = getAccessToken()
    if (!access_token)
        return null
    else {
        const payload = decodeJwt(access_token)
        const authenticatedUser = {
            username: payload.sub,
            nom: payload.nom,
            prenom: payload.prenom,
            roles: payload.roles,
        }
        return authenticatedUser
    }
}
export const getAccessToken=()=>{
    let jwtToken=localStorage.getItem("access_token")
    if (!jwtToken)
        return null
    const payload = decodeJwt(jwtToken);
    const exp = payload.exp;
    if (exp*1000<Date.now()) {
        const refresh_token = localStorage.getItem("refresh_token");
        const headers=new AxiosHeaders()
        headers.set("Authorization","Bearer "+refresh_token)
        axios.get(`${serverAdress}/refreshToken`,{headers:headers})
            .then(response=>{
                localStorage.setItem("access_token",response.data.access_token)
                localStorage.setItem("refresh_token",response.data.refresh_token)
                jwtToken=response.data.access_token
            })
    }
    return jwtToken
}
export const Logout=()=>{
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
}