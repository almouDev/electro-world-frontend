export  default function Forbidden(props){
    const message=props.message||"Vous n'est pas authoriser à acceder à cette resource"
    return(
        <h1>{message}</h1>
    )
}