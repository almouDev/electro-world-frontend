import React, {useContext, useReducer, useState} from 'react';
import ReactDOM from 'react-dom/client';
import "bootstrap/dist/css/bootstrap.min.css"
import {Router} from './Pages/Router';
import "./Css/App.css"
import "bootstrap/dist/js/bootstrap.min.js"
import "./Css/fontawesome-free-6.2.1-web/css/all.min.css"
import 'swiper/css';
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/thumbs"
import "swiper/css/free-mode"
import {AuthenticatedUser} from "./Services/services/Authentication";
import PropTypes from "prop-types";
class App extends React.Component{
  constructor(props) {
    super(props);
    this.state={authenticatedUser:AuthenticatedUser()}
      this.setUser=this.setUser.bind(this)
  }
  getChildContext(){
    return {authenticatedUser:this.state.authenticatedUser,setUser:this.setUser}
  }
  setUser(user){
    this.setState({authenticatedUser:user})}

    render(){
    return(
        <Router/>
    )
  }
}
const root=ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>)
App.childContextTypes={authenticatedUser: PropTypes.object,setUser:PropTypes.func}