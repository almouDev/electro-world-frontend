import {element} from "prop-types";

const ajouterPanier=(product,showAlert,setCount)=>{
    const client_cart=localStorage.getItem("client_cart")
    if (client_cart) {
        const client_cart_json=JSON.parse(client_cart)
        if (isProductInCart(product.id)[0])
            client_cart_json[isProductInCart(product.id)[0].position].quantity+=1
        else{
            client_cart_json.push({quantity:1,product:product})
            setCount(client_cart_json.length)
        }
        localStorage.setItem("client_cart",JSON.stringify(client_cart_json))
    }
    else {
        localStorage.setItem("client_cart",JSON.stringify([{quantity:1,product:product}]))
        setCount(0)
        }
    showAlert(true)
    const timeout=setTimeout(()=>{
        showAlert(false)
        clearTimeout(timeout)
    },5000)
}
const isProductInCart=(id)=>{
    const client_cart=localStorage.getItem("client_cart")
    const client_to_json=JSON.parse(client_cart)
    return client_to_json.map((product,num)=>{
        if (product.product.id==id){
            return {position:num,quantity:product.quantity}
        }
    }).filter(ele=>ele)
}
const deleteProduct=(id)=>{
    const client_cart=localStorage.getItem("client_cart")
    const client_to_json=JSON.parse(client_cart)
    localStorage.setItem("client_cart",JSON.stringify(client_to_json.filter(ele=>ele.product.id!==id)))
}
const decrementProduct=(id)=>{
    const client_cart=localStorage.getItem("client_cart")
    let client_to_json=JSON.parse(client_cart)
    client_to_json=client_to_json.map(element=>{
        if (element.product.id==id){
            element.quantity-=1
        }
        return element
    })
    localStorage.setItem("client_cart",JSON.stringify(client_to_json))
}
const getCartSize=()=>{
    const client_cart=localStorage.getItem("client_cart")
    return client_cart?JSON.parse(client_cart).length:0
}
export {ajouterPanier,isProductInCart,decrementProduct,deleteProduct,getCartSize}