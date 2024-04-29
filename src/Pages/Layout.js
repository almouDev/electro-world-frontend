import React from "react";
import { Outlet} from "react-router-dom"
import Header from "../Components/Header";

export default class Layout extends React.Component{
    render() {
        return(
            <>
                <Outlet/>
            </>
        )
    }

}