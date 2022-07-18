import React,{useState,useEffect} from 'react'
import Menu from "../Menu/Menu"
import {API_URL} from "../config";
import toastr from 'toastr';
import "toastr/build/toastr.css";
import { ImBin,ImPencil,ImNotification } from "react-icons/im";
import {IoIosMenu} from "react-icons/io";
const Compt=()=>{
    const [menu,setMenu]=useState(true);
    const [formulaire,setFormulaire]=useState(true);
    const [formulaireBtn,setFormulaireBtn]=useState("Ajouter");
    const showMenu=()=>{
        setMenu(false)
      }
      const hideMenu=()=>{
        setMenu(true);
      }
      const showFormulaire=()=>{
        setFormulaire(false);
      }
      const hideFormulaire=()=>{
        setFormulaire(true);
        setFormulaireBtn("Ajouter");
      }
    const [admin,setAdmin]=useState({
        nom:"",
        prenom:"",
        login:"",
        pw:""
    });
    
    const [formdata,setFormdata]=useState(new FormData());
    const handleChange=(e)=>{
     const value=e.target.name=="photo"?e.target.files[0]:e.target.value;
     formdata.set(e.target.name,value);
     setAdmin({...admin,[e.target.name]:e.target.value});
    }
    const update=()=>{
      const jwt=JSON.parse(localStorage.getItem("user"));
        fetch(`${API_URL}/admin/update/${jwt._id}`,{
            method:"POST",
            headers:{
             "Accept":"application/json",
            },
            body:formdata
           }).then(res=>res.json()).then(res=>{
            if(res.token){
              toastr.success(`${res.msg}`,"Operation valide",{positionClass:"toast-bottom-right"});
              localStorage.setItem('user',JSON.stringify(res));
              
              window.location.reload();
            }
            else
              console.log(res);
           }).catch(err=>console.log(err));

    }
    useEffect(()=>{
        const jwt=JSON.parse(localStorage.getItem("user"));
        fetch(`${API_URL}/admin/getcompt/${jwt._id}`,{
            method:"GET",
            headers:{
             "Accept":"application/json",
             "Content-Type":"application/json"
            }
           }).then(res=>res.json()).then(res=>{
            if(res.a){

              setAdmin(res.a);
              formdata.set("nom",res.a.nom);
              formdata.set("prenom",res.a.prenom);
              formdata.set("login",res.a.login);
              formdata.set("pw","");
            }
              else
              console.log(res);
           }).catch(err=>console.log(err));
 
    },[])
  return (
    <div className="containerDashbord">
    <Menu hideMenu={hideMenu} menu={menu}/>
    <div className="bodyDahbord">

    <IoIosMenu onClick={showMenu} className="IconMenu"/>
    <center>
        <h2>Votre compt</h2>
        <div className="continer_input_formulaire">
          <div>Photo: </div>
          <input type="file" name="photo"  onChange={handleChange} />
        </div>
 <br />

        <div className="continer_input_formulaire">
          <div>Nom: </div>
          <input type="text" name="nom"    onChange={handleChange} value={admin.nom} className="inputFormulaireCompt" />
        </div>
 <br />
 <div className="continer_input_formulaire">
          <div>Prenom: </div>
          <input type="text" name="prenom"    onChange={handleChange} value={admin.prenom} className="inputFormulaireCompt" />
        </div>
 <br />
 <div className="continer_input_formulaire">
          <div>login: </div>
          <input type="text" name="login"    onChange={handleChange} value={admin.login} className="inputFormulaireCompt" />
        </div>
 <br />
 <div className="continer_input_formulaire">
          <div>Mot de passe: </div>
          <input type="text" name="pw"    onChange={handleChange} value={admin.pw} className="inputFormulaireCompt" />
        </div>
 <br />
 <input type="Button" value="Moddifier" onClick={update} className="inputBtnSearch" />
    </center>
    </div>
  </div>  )
}

export default Compt