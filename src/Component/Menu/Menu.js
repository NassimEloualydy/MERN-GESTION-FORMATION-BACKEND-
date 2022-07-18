import React,{useState,useEffect} from 'react'
import "../style.css";
import {API_URL} from "../config";
import {ImLab,ImUsers,ImUser,ImExit} from "react-icons/im";
import {IoClipboardOutline} from "react-icons/io5";
import { FaUserGraduate,FaHotTub } from "react-icons/fa";
import toastr from 'toastr';
import {useNavigate} from "react-router-dom";

const Menu=(props)=>{
  const [admin,setAdmin]=useState({});
  const Navigate=useNavigate();
  const Quitter=()=>{
    fetch(`${API_URL}/admin/quitter`,{
      method:"GET",
      headers:{
        "Accept":"application/json",
        "Content-Type":"application/json"
      }
    }).then(res=>res.json()).then(res=>{
        if(res.msg){
          toastr.success(`${res.msg}`,"Au revoire",{positionClass:"toast-bottom-right"});
          Navigate("/Login");
          localStorage.clear("user");
        }else{
          console.log(res);
        }
    }).catch(err=>console.log(err));
  }
  const urlNavigate=(url)=>{
    Navigate(url);
  }
  useEffect(()=>{
     const user=localStorage.getItem("user");
     setAdmin(JSON.parse(user));
  },[])
  return (
<div className={props.menu?"menu":"showMenu"}>
        <center>
          <h1>Menu</h1>               
          <br/>
          
          <div onClick={props.hideMenu} className="menu_item_img">
            <div className="container_menu_item">
            <div><img src={`${API_URL}/admin/getimage/${admin._id}`} alt="" className="compt_admin" /></div>
            <div style={{lineHeight:"80px"}}>{admin.nom} {admin.prenom}</div>
            </div>
          </div>

          <div onClick={props.hideMenu && urlNavigate.bind(this,'/Filier')} className="menu_item">
            <div className="container_menu_item">
            <div>Filier</div>
            <ImLab className="icon_menu"/>
            </div>
          </div>

          <div onClick={props.hideMenu && urlNavigate.bind(this,'/Group')} className="menu_item">
          <div className="container_menu_item">
            <div>Group</div>
            <ImUsers className="icon_menu"/>
            </div>
          </div>

          <div onClick={props.hideMenu && urlNavigate.bind(this,'/Etudient')} className="menu_item">
          <div className="container_menu_item">
            <div>Etudient</div>
            <ImUser className="icon_menu"/>
            </div>
          </div>
          
          <div onClick={props.hideMenu && urlNavigate.bind(this,'/Formateur')} className="menu_item">
          <div className="container_menu_item">
            <div>Formateur</div>
            <FaUserGraduate className="icon_menu"/>

            </div>
          </div>

          <div onClick={props.hideMenu && urlNavigate.bind(this,'/Module')} className="menu_item">
          <div className="container_menu_item">
            <div>Module</div>
            <IoClipboardOutline className="icon_menu"/>
            </div>
          </div>
          
          <div onClick={props.hideMenu && urlNavigate.bind(this,'/Vacation')} className="menu_item">
          <div className="container_menu_item">
            <div>Vacation</div>
            <FaHotTub className="icon_menu"/>
            </div>
          </div>

          <div onClick={props.hideMenu  && urlNavigate.bind(this,'/Compt')} className="menu_item">
          <div className="container_menu_item">
            <div>Votre compt</div>
            <ImUser className="icon_menu"/>
            </div>
          </div>
       
          
          <div onClick={Quitter} className="menu_item">
          <div className="container_menu_item">
            <div>Quitter</div>
            <ImExit className="icon_menu"/>
            </div>
          </div>


        </center>
      </div>  )
}

export default Menu