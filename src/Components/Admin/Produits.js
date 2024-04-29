import {Pagination, Table} from "react-bootstrap";
import {useEffect, useReducer, useState} from "react";
import HttpService from "../../Services/services/HttpService.ts";
import {serverAdress} from "../../Pages/Constants";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetch, remove, update} from "./manage.products/productSlice";
import {MyModal} from "./modal";
import {productStore} from "./manage.products/productStore";
import {EditProduct} from "./EditProduct";

export function Produits({}){
    const size=8
    const searchProduct=(event)=>{
        setSearch(event.target.value)
    }
    function getPages(produits,size){
        let pages=Math.trunc(produits.length/size)
        if (!produits.length%size==0)
            pages+=1
        return pages
    }
    const [search,setSearch]=useState()
    const [filter,setFilter]=useState("designation")
    const products=useSelector(state => state.products.value)
    const dispatch=useDispatch()
    const [page,setPage]=useReducer((prevState,action)=>{
        const x=(1+prevState.currentPage)*size
        const {...newState}=prevState
        switch (action.type){
            case "next":
                newState.currentPage=prevState.currentPage+1
                newState.products=products.slice(x,x+size)
                return newState
            case "prev":
                newState.currentPage=prevState.currentPage-1
                newState.products=products.slice((prevState.currentPage-1)*size,(prevState.currentPage-1)*size+size)
                return newState
            case "jump":
                newState.currentPage=action.num
                newState.products=products.slice(action.num*size,action.num*size+size)
                return newState
            default :
                if (action.payload)
                    return action.payload
                else throw new Error("False action")
        }
    },{currentPage:0,products:products.slice(0,size),total:getPages(products,size)})

    //@useEffect hook
    useEffect(()=>{
        let searchValue=" "
        if (search)
            searchValue=filter=="designation"?`/search/designation?titre=${search}`:`/search/categorie?nom=${search}`
        HttpService.getProducts(`${searchValue}`)
            .then(response=> {
                const prods=response.data._embedded.articles.map(article=>{
                    const {_links,...prod}=article
                    return prod
                })
                dispatch(fetch(prods))
                setPage({payload:{currentPage:0,products:prods.slice(0,size),total:getPages(prods,size)}})
            })
    },[search])
    //@Delete a product
    const deleteProduct=(product)=>{
        HttpService.deleteProduct(product.id)
            .then(res=>{
                dispatch(remove(product))
                const prods=productStore.getState().products.value
                const {...newPage}=page
                const products=prods.slice(page.currentPage*size,page.currentPage*size+size)
                if (products.length>0)
                    newPage.products=products
                else
                    newPage.products=prods.slice((page.currentPage-1)*size,(page.currentPage-1)*size+size)
                setPage({payload:newPage})
            })
    }
    //@Update a product
    const editProduct=(product)=>{
        HttpService.editProduct(product)
            .then(response=>{
               dispatch(update(product))
               const prods=productStore.getState().products.value
               const {...newPage}=page
               newPage.products=prods.slice(page.currentPage*size,page.currentPage*size+size)
               setPage({payload:newPage})
            })
    }

    return(
        <>
        <div className="container">
            <form className="mb-2 mt-3 d-flex">
                <div className="d-flex justify-content-center align-items-center col-4 bg-white " style={{height:"4rem"}}>
                    <h4><label className="fas d-block fa-search"></label></h4>
                <input placeholder="Filter par " className="form-control-plaintext d-block h-100"  onChange={searchProduct}/>
                </div>
                <div>
                    <select className="form-select mx-1" style={{height:"4rem"}} onChange={(e)=>{setFilter(e.target.value)}}>
                        <option value={"designation"} defaultValue>Désignation</option>
                        <option value="categorie" >Catégorie</option>
                    </select>
                </div>
            </form>
            <ProductsTable products={page.products}  editProduct={(product)=>{editProduct(product)}} deleteProduct={(product)=>{deleteProduct(product)}}/>
            <div className="d-flex container justify-content-between">
            {
                products?.length>size?
                    <Pagination size={"lg"}>
                        <Pagination.First/>
                        <Pagination.Prev disabled={page.currentPage==0} onClick={()=>{setPage({type:"prev"})}}/>
                        {
                            Array(page.total).fill(0).map((item,key)=>{
                                return <Pagination.Item active={key==page.currentPage} key={key}><div onClick={()=>{setPage({type:"jump",num:key})}}>{key+1}</div></Pagination.Item>
                            })
                        }
                        <Pagination.Next disabled={page.currentPage==page.total-1} onClick={()=>{setPage({type:"next"})}}/>
                        <Pagination.Last/>
                    </Pagination>:""
            }
                <button className="btn btn-primary"><Link className="nav-link" to={"../ajout_produit"}>Ajouter un produit</Link></button>
            </div>
        </div>
        </>

    )
}
const ProductsTable=({products,editProduct,deleteProduct})=>{
    const [show,setShow]=useState(false)
    const [product,setProduct]=useState({})
    const [showForm,setShowForm]=useState(false)
    const confirmation=(e)=>{
        if (e.currentTarget.getAttribute("aria-label")=="positive") {
            deleteProduct(product)
            setProduct({})
            setShow(false)
        }
        else setShow(false)
        }
        const submit=(prod)=>{
        setShowForm(false)
        editProduct(prod)
        }
    return(
        <>
            <EditProduct submit={submit} show={showForm} onHide={()=>{setShowForm(false)}} prod={product}/>
            <MyModal show={show} onHide={()=>{setShow(false)}} confirmation={(e)=>{
                confirmation(e)
            }}/>
        <Table className="bg-white"  bordered={true}>
            <thead>
            <tr>
                <th><h4>Désignation</h4></th>
                <th><h4>Prix</h4></th>
                <th><h4>Quantité en stock</h4></th>
                <th><h3>#</h3></th>
                <th><h3>#</h3></th>
            </tr>
            </thead>
            <tbody>
            {
                products?
                products.map((product,key)=>{
                    return(
                        <tr key={key} className="m-3">
                            <td><h4>{product.designation}</h4></td>
                            <td><h4>{product.prix} Dh</h4></td>
                            <td><h4>{product.stock}</h4></td>
                            <td><h4 onClick={()=>{
                                setShow(true)
                                setProduct(product)
                                }} className="fa-solid text-danger fa-trash"></h4></td>
                            <td><h4 onClick={()=>{
                                setShowForm(true)
                                setProduct(product)}} className="fa-solid  fa-pen-to-square"></h4></td>
                        </tr>
                    )
                }):<tr><td><h3 className="text-danger mx-auto">Aucun produit ne correspond </h3></td></tr>
            }
            </tbody>
        </Table>
        </>
    )
}
const fakeProducts=[
    {id:1,designation:"designation 1",stock:100},
    {id:2,designation:"designation 2",stock:100},
    {id:3,designation:"designation 3",stock:100},
    {id:4,designation:"designation 4",stock:100},
    {id:5,designation:"designation 5",stock:100},
    {id:6,designation:"designation 6",stock:100},
    {id:7,designation:"designation 7",stock:100},
    {id:8,designation:"designation 8",stock:100},
    {id:9,designation:"designation 9",stock:100},
    {id:10,designation:"designation 10",stock:100},
    {id:11,designation:"designation 11",stock:100},
    {id:12,designation:"designation 12",stock:100},


]