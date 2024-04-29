import React from "react";
import axios from "axios";
export default class Pages extends React.Component{
    componentDidMount() {
        axios.get("http://localhost:8080/articles")
    }

    render() {
        return undefined;
    }
}