import React from 'react'
import {Login} from "../Component/Login";
import {Outlet,Navigate} from "react-router-dom";
const isAuthenticated=()=>{
    const JWT=localStorage.getItem("user");
    if(JWT){
        return JSON.stringify(JWT);
    }else{
        return false;
    }
}
const  PravetRoute=()=>{
  return isAuthenticated()?<Outlet/>:<Navigate to='/Login'/>;
}

export default PravetRoute