import React,{useState} from 'react'
import { API_URL } from './config';
import {useNavigate} from "react-router-dom";
import toastr from 'toastr';
import "toastr/build/toastr.css";
const Login=()=>{
    const Navigate=useNavigate(); 
    const [loginPage,setLoginPage]=useState(true);
    const [formdata,setFormdata]=useState(new FormData());
    const [login,setLogin]=useState({
      login:"",pw:""
    });
    const [inscrire,setInscrire]=useState({
      nom:"",prenom:"",login:"",pw:""
    });
    const handleChangeLogin=(e)=>{
      setLogin({...login,[e.target.name]:e.target.value});
    }
    const SwitchLogin=(valueL)=>{
      setLoginPage(valueL);
      setLogin({login:"",pw:""});
      setInscrire({
        nom:"",prenom:"",login:"",pw:""
      })

    }
    const connexion=()=>{
      fetch(`${API_URL}/admin/connexion`,{
        method: 'POST',
        headers: {
          "Accept":"application/json",
          "Content-Type":"application/json"
        },
        body:JSON.stringify(login)
      }).then(res=>res.json()).then(res=>{
        if(res.err){
          toastr.warning(`${res.err}`,"Operation invalide !!",{positionClass:"toast-bottom-right"});
        }else{
          localStorage.setItem("user",JSON.stringify(res));
          toastr.info("Connexion avec succes",`Bonjour ${res.nom} ${res.prenom}`)
          setLogin({login:"",pw:""});
          Navigate('/filier');
            
        }

      }).catch(err=>console.log(err));
    }
    const handleChangeInscrire=(e)=>{
      const value=e.target.name=="photo"?e.target.files[0]:e.target.value;
      formdata.set(e.target.name,value);
      setInscrire({...inscrire,[e.target.name]:e.target.value});
    }
    const inscription=()=>{
      fetch(`${API_URL}/admin/inscrire`,{
        method:"POST",
        headers: {
          "Accept":"application/json"
        // "Content-Type":"application/json"
        },
        body:formdata
      }).then(res=>res.json()).then(res=>{
        if(res.err){
          toastr.warning(`${res.err}`,"Operation invalide !!",{positionClass:"toast-bottom-right"})
        }  
        if(res.msg){
          toastr.success(`${res.msg}`,"Operation valide",{positionClass:"toast-bottom-right"});
          SwitchLogin("true");
          setInscrire({
            nom:"",prenom:"",login:"",pw:""
          })
        }else{
          console.log(res);
        }  
   
      }).catch(err=>console.log(err))
    }
  return (
    <div className="body">
       <div className={loginPage?'connexion':'inscription'}>
       {/* sign up */}
     <div className="container_login">
       <div className="box_login">
       <center>
            <h3>Page de connexion</h3>
            <div className="containerInputLogin">
              <div>Login :</div>
              <input type="text" name="login" onChange={handleChangeLogin} value={login.login} className="inputLogin" />
            </div>
            <div className="containerInputLogin">
              <div>Mot de passe :</div>
              <input type="text"  name="pw" onChange={handleChangeLogin} value={login.pw} className="inputLogin" />
            </div>
            <input type="button" value="Connexion" onClick={connexion}   className="btn_input_login" /><br/><br/>
            <input type="button" value="Inscription" onClick={SwitchLogin.bind(this,false)}  className="btn_input_login" />
         </center>

       </div>
       <div className="box_login_img" style={{backgroundColor:"blueviolet"}}>
       </div>
     </div>

       {/* endsign up */}
       {/* sign in */}
       <div className="container_login">
       <div className="box_login_img" style={{backgroundColor:"blueviolet"}}>
       </div>
       <div className="box_login">
       <center>
         <h3>Page d' inscription</h3>
         <div className="containerInputLogin">
              <div>Image :</div>
              <input type="file" name="photo" onChange={handleChangeInscrire}  />
            </div>

         <div className="containerInputLogin">
              <div>Nom :</div>
              <input type="text" name="nom" onChange={handleChangeInscrire} value={inscrire.nom} className="inputLogin" />
            </div>

            <div className="containerInputLogin">
              <div>Prenom :</div>
              <input type="text" name="prenom" onChange={handleChangeInscrire} value={inscrire.prenom} className="inputLogin" />
            </div>

            <div className="containerInputLogin">
              <div>Login :</div>
              <input type="text" name="login" onChange={handleChangeInscrire} value={inscrire.login} className="inputLogin" />
            </div>

            <div className="containerInputLogin">
              <div>Mot de passe :</div>
              <input type="text" name="pw" onChange={handleChangeInscrire} value={inscrire.pw} className="inputLogin" />
            </div>

         <input type="button" value="Inscription"  onClick={inscription} className="btn_input_login" /><br/><br/>
         <input type="button" value="Connexion" onClick={SwitchLogin.bind(this,"true")}  className="btn_input_login" />

         </center>

       </div>
     </div>
       
       {/* endsign in */}
       </div>        
    </div>
  )
}

export default Login