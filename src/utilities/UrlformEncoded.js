const UrlformEncoded= (data)=>{
    var formBody=""
    for(let key in data){
        if(formBody!="")
            formBody+="&"+key+"="+data[key]
        else
            formBody+=key+"="+data[key]
    }
    return formBody;
}
const UrlformDecoder=(data)=>{
    const url=data.split("&")
    let urlParams={}
    for (let i=0;i<url.length;i++){
        let ele=url[i].split("=")
        urlParams[ele[0]]=ele[1]
    }
    return urlParams
}
export {UrlformDecoder,UrlformEncoded}