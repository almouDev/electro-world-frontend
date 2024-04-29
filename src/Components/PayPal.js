import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js";

const PayPalPay=(props)=>{
    return(
        <PayPalScriptProvider  options={props.options}>
            <PayPalButtons forceReRender={true} fundingSource={props.fundingSource}/>
        </PayPalScriptProvider>
    )
}
export {PayPalPay}