import React,{useState} from 'react'
import "../style.css"
import Menu from "../Menu/Menu"
import {IoIosMenu} from "react-icons/io";

const Dashbord=()=>{
  const [menu,setMenu]=useState(true);
  const [formulaire,setFormulaire]=useState(true);
  const showMenu=()=>{
    setMenu(false)
  }
  const hideMenu=()=>{
    setMenu(true);
  }
  const showFormulaire=()=>{
    setFormulaire(false);
  }
  return (
    <div className="containerDashbord">
      <Menu hideMenu={hideMenu} menu={menu}/>
      <div className="bodyDahbord">

      <IoIosMenu onClick={showMenu} className="IconMenu"/>
      <div className={formulaire?"formulaire":"showFormulaire"}>
        <center>
          <h1>Formulaire Filier</h1>
        </center>
      </div>
      <center>
        <br />
      <div className="containet_chart">
        
      </div>
      <br />
     <div className="list">
       <input type="Button" value="Novelle" onClick={showFormulaire} className="btn_mewItem" />
     </div>
      </center>
      </div>
    </div>
  )
}

export default Dashbord