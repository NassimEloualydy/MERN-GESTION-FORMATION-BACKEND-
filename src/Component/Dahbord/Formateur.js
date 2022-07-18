import React,{useState,useEffect} from 'react'
import Menu from "../Menu/Menu"
import {API_URL} from "../config";
import toastr from 'toastr';
import "toastr/build/toastr.css";
import { ImBin,ImPencil,ImNotification } from "react-icons/im";
import {AiOutlineSend} from "react-icons/ai";
import {IoIosMenu} from "react-icons/io";
import {Bar,Doughnut,Bubble} from "react-chartjs-2";
import Chart from 'chart.js/auto';

const  Formateur=()=>{
    const [menu,setMenu]=useState(true);
    const [formulaire,setFormulaire]=useState(true);
    const [formulaireBtn,setFormulaireBtn]=useState("Ajouter");
    const [formateurs,setFormateurs]=useState([]);
    const [idFormateur,setIdFormateur]=useState("");
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
        setFomrmateur({
          nom:"",
          prenom:"",
          email:"",
          tel:"",
          nbrHeur:"",
          prixHeur:""         
        });
        getAll(skip);
      }
      const [formdata,setFormdata]=useState(new FormData());
      const [formateur,setFomrmateur]=useState({
        nom:"",
        prenom:"",
        email:"",
        tel:"",
        nbrHeur:"",
        prixHeur:""        
      });
      const handleChange=(e)=>{
        const value=e.target.name=="photo"?e.target.files[0]:e.target.value;
        formdata.set(e.target.name,value);
        setFomrmateur({...formateur,[e.target.name]:e.target.value});
      }
      const submitBtn=()=>{
        if(formulaireBtn=="Ajouter"){
          fetch(`${API_URL}/formateur/add`,{
            method:"POST",
            headers:{
              "Accept":"application/json",
              // "Content-Type":"application/json"
            },
            body:formdata
           }).then(res=>res.json()).then(res=>{
            if(res.err)
              toastr.warning(`${res.err}`,"Operation invalide !!",{positionClass:"toast-bottom-right"});
              if(res.msg){
                toastr.success(`${res.msg}`,"Operation valide !!",{positionClass:"toast-bottom-right"});
                hideFormulaire();
              }else
              console.log(res);
           }).catch(err=>console.log(err));        
  
        }else{
          fetch(`${API_URL}/formateur/update/${idFormateur}`,{
            method:"POST",
            headers:{
              "Accept":"application/json",
              // "Content-Type":"application/json"
            },
            body:formdata
           }).then(res=>res.json()).then(res=>{
            if(res.err)
              toastr.warning(`${res.err}`,"Operation invalide !!",{positionClass:"toast-bottom-right"});
              if(res.msg){
                toastr.success(`${res.msg}`,"Operation valide !!",{positionClass:"toast-bottom-right"});
                hideFormulaire();
              }else
              console.log(res);
           }).catch(err=>console.log(err));        
  

        }
      }
      const [skip,setSkip]=useState(0);
      const pagination=(pa)=>{      
        if(skip+pa>=0){
         setSkip(skip+pa)
         getAll(skip+pa)
        }
      }
const getAll=(skip)=>{
   fetch(`${API_URL}/formateur/getAll/${skip}`,{
    method:"POST",
    headers:{
      "Accept":"application/json",
      "Content-Type":"application/json"
    },
    body:JSON.stringify(searchFormateur)
   }).then(res=>res.json()).then(res=>{
    if(res.f){
      setFormateurs(res.f);
      var label1=[];
      var data1=[];
      var data2=[];
      for(const data of res.f){
        label1.push(data.nom+" "+data.prenom); 
        data1.push(data.nbrHeur); 
        data2.push(data.prixHeur)
       }
       setPrixHeurData({
        labels:label1,
        datasets:[{
         label:"le prix pour chaque formateur",
         data:data2,
         backgroundColor: [
           'rgba(255, 99, 132, 0.2)',
           'rgba(255, 159, 64, 0.2)',
           'rgba(255, 205, 86, 0.2)',
           'rgba(75, 192, 192, 0.2)',
           'rgba(54, 162, 235, 0.2)',
           'rgba(153, 102, 255, 0.2)',
           'rgba(201, 203, 207, 0.2)'
         ],
         borderColor: [
           'rgb(255, 99, 132)',
           'rgb(255, 159, 64)',
           'rgb(255, 205, 86)',
           'rgb(75, 192, 192)',
           'rgb(54, 162, 235)',
           'rgb(153, 102, 255)',
           'rgb(201, 203, 207)'
         ],
               borderWidth: 1
             
        }]  

       })
      setNbrHeurData({ 
            labels:label1,
        datasets:[{
         label:"Nombre des heur pour chaque formateur",
         data:data1,
         backgroundColor: [
           'rgba(255, 99, 132, 0.2)',
           'rgba(255, 159, 64, 0.2)',
           'rgba(255, 205, 86, 0.2)',
           'rgba(75, 192, 192, 0.2)',
           'rgba(54, 162, 235, 0.2)',
           'rgba(153, 102, 255, 0.2)',
           'rgba(201, 203, 207, 0.2)'
         ],
         borderColor: [
           'rgb(255, 99, 132)',
           'rgb(255, 159, 64)',
           'rgb(255, 205, 86)',
           'rgb(75, 192, 192)',
           'rgb(54, 162, 235)',
           'rgb(153, 102, 255)',
           'rgb(201, 203, 207)'
         ],
               borderWidth: 1
             
        }]  
   })
    }
    else
      console.log(res);
   }).catch(err=>console.log(err));
}
const deleteFormateur=(id)=>{
  if(window.confirm("Voulez vous vraiment supprimer cet formateur !!"))
  fetch(`${API_URL}/formateur/delete/${id}`,{
    method:"DELETE",
    headers:{
      "Accept":"application/json",
      "Content-Type":"application/json"
    }
  }).then(res=>res.json()).then(res=>{
    if(res.msg){
      toastr.success(`${res.msg}`,"Operation valide !!",{positionClass:"toast-bottom-right"});
      hideFormulaire();
    }else
    console.log(res);
  }).catch(err=>console.log(err));
}
const updateFormateur=(f)=>{
  setFormulaireBtn("Moddifier");
  setFomrmateur({
    nom:f.nom,
    prenom:f.prenom,
    email:f.email,
    tel:f.tel,
    nbrHeur:f.nbrHeur,
    prixHeur:f.prixHeur         
  });
   formdata.set("nom",f.nom);
   formdata.set("prenom",f.prenom);
   formdata.set("email",f.email);
   formdata.set("tel",f.tel);
   formdata.set("nbrHeur",f.nbrHeur);
   formdata.set("prixHeur",f.prixHeur);
   showFormulaire();
   setIdFormateur(f._id);
}
const [searchFormateur,setSearchFormateur]=useState({
  nom:"",
  prenom:"",
  email:"",
  tel:"",
  nbrHeur:"",
  prixHeur:""        

})
const handleChangeSearch=(e)=>{
  setSearchFormateur({...searchFormateur,[e.target.name]:e.target.value});
}
const searchBtn=()=>{
  getAll(skip);
}
const [email,setEmail]=useState({objet:"",message:""});
const [emailTo,setEmailTo]=useState("");
const [emailCard,setEmailCard]=useState(true);

const emailFormateur=(f)=>{
  setEmailTo(f.email);
  setEmailCard(false);

}
const handleChngeEmail=(e)=>{
  setEmail({...email,[e.target.name]:e.target.value});
}
const hideCardEmail=()=>{
  setEmailCard(true);
  setEmail({
   objet:"",message:""
  })
  }

 const sendEmail=()=>{
   fetch(`${API_URL}/formateur/sendEmail/${emailTo}`,{
    method:"POST",
    headers:{
      "Accept":"application/json",
      "Content-Type":"application/json"
    },
    body:JSON.stringify(email)
   }).then(res=>res.json()).then(res=>{
     if(res.msg){
      toastr.success(`${res.msg}`,"Operation valide !!",{positionClass:"toast-bottom-right"});
      hideCardEmail();
     }else
     console.log(res)
   }).catch(err=>console.log(err));
 }
const [nbrHeurData,setNbrHeurData]=useState({
  lebels:[],
  datasets:[{
    label:"nombre des heur pour chaque formateur",
    data:[],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
    borderWidth: 1

  }]
});
const [prixHeurData,setPrixHeurData]=useState(
  {
    lebels:[],
    datasets:[{
      label:"nombre des heur pour chaque formateur",
      data:[],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
  
    }]
  
  }
);

useEffect(()=>{
  getAll(skip);

},[])
  return (
    <div className="containerDashbord">
    <Menu hideMenu={hideMenu} menu={menu}/>
    <div className="bodyDahbord">

    <IoIosMenu onClick={showMenu} className="IconMenu"/>
        {/* email card */}
        <div className={emailCard?"emailCard":"showemailCard"}>
       <center>
        <h3>Formulaire d'envoyer un email</h3>
        <div className="containerDetail">
        <div className="conatinerInputDetail">
          <div><h3>Objet :</h3></div>
          <div><textarea cols="40" name="objet" onChange={handleChngeEmail}  className="inputFormulaire" style={{border: "1px solid white",borderRadius:"5px"}} rows="1"></textarea></div>
        </div>
        <div className="conatinerInputDetail">
          <div><h3>Text :</h3></div>
          <div><textarea cols="40" name="message" onChange={handleChngeEmail}  className="inputFormulaire" style={{border: "1px solid white",borderRadius:"5px"}} rows="10"></textarea></div>
        </div>
        <br />
<br />
<input type="button" value="Envoyer" onClick={sendEmail} className='inputBtnFormulaire' />&nbsp;
<input type="button" value="Reteur" onClick={hideCardEmail} className='inputBtnFormulaire' />

       </div>
       </center>
    </div>
    {/* email card */}

    <div className={formulaire?"formulaire":"showFormulaire"}>
      <center>
        <h3>Formulaire Formateur</h3>
        <br/>
        <div className="continer_input_formulaire">

          <div>Image: </div>
          <input type="file" name="photo"  onChange={handleChange}   className="inputFormulaire" />
        </div>
        <br />

        <div className="continer_input_formulaire">
          <div>Nom: </div>
          <input type="text" name="nom"  value={formateur.nom} onChange={handleChange}  className="inputFormulaire" />
        </div>
        <br />

        <div className="continer_input_formulaire">
          <div>Prenom: </div>
          <input type="text" name="prenom"  value={formateur.prenom} onChange={handleChange}  className="inputFormulaire" />
        </div>
        <br />
        <div className="continer_input_formulaire">
          <div>Email: </div>
          <input type="text" name="email"  value={formateur.email} onChange={handleChange}  className="inputFormulaire" />
        </div>
        <br />
        <div className="continer_input_formulaire">
          <div>Telephone: </div>
          <input type="text" name="tel"  value={formateur.tel} onChange={handleChange}  className="inputFormulaire" />
        </div>
        <br />
        <div className="continer_input_formulaire">
          <div>Nombre des heure: </div>
          <input type="text" name="nbrHeur"  value={formateur.nbrHeur} onChange={handleChange}  className="inputFormulaire" />
        </div>
        <br />
        <div className="continer_input_formulaire">
          <div>Prix par heure: </div>
          <input type="text" name="prixHeur"  value={formateur.prixHeur} onChange={handleChange}  className="inputFormulaire"/>
        </div>
        <br />
        

        <br/>
        <input type="button" value={formulaireBtn} onClick={submitBtn}  className='inputBtnFormulaire' />&nbsp;
        <input type="button" value="Annuler" onClick={hideFormulaire} className='inputBtnFormulaire' />
      </center>
    </div>
    <center>
      <br />
      <br />
      <h3 className="title_chart">Les statestic</h3>
      <div className="container_chart_bar">
      <div className="barItem">
        <center>
          <h3>Nombre des Group par filier</h3>
      <Bar data={prixHeurData}/>
        </center>
      </div>
      <br />
      <div className="barItem">
        <center>
          <h3>Nombre des Group pour chaque annee</h3>
      <Bar data={nbrHeurData}/>
        </center>
      </div>
      </div>
     
    <br />

    <br />
    <div className="container_list">

   <div className="list">
    <div className="list_table">
      <div className="bar_recherch">
        <center>
          <h3>La bare de recherch</h3>
          <div className="contianerInputSearch">
                 <input type="text" name="nom" placeholder='Nom'  onChange={handleChangeSearch}  className="inputSearch" /><br /><br />
                 <input type="text" name="prenom" placeholder='prenom' onChange={handleChangeSearch}  className="inputSearch" />
          </div>
          <br />
          <div className="contianerInputSearch">
                 <input type="text" name="email" placeholder='email'  onChange={handleChangeSearch}  className="inputSearch" /><br /><br />
                 <input type="text" name="tel" placeholder='telephone' onChange={handleChangeSearch}  className="inputSearch" />
          </div>
          <br />
          <div className="contianerInputSearch">
                 <input type="text" name="nbrHeur" placeholder='Nombre des heure'  onChange={handleChangeSearch}  className="inputSearch" /><br /><br />
                 <input type="text" name="prixHeur" placeholder='prix par heure' onChange={handleChangeSearch}  className="inputSearch" />
          </div>
          <br />

          <input type="Button" value="Chercher"  onClick={searchBtn} className="inputBtnSearch" />

        </center>
      </div>
     <input type="Button" value="Novelle" onClick={showFormulaire} className="btn_mewItem" />
     <br />
     <br />
     <div className='tableList'>
     <table>
      <tbody>
 
      <tr id="header">
          <th></th>
          <th>Nom</th>
          <th>Prenom</th>
          <th>Email</th>
          <th>Telephone</th>
          <th>Nombre des heure</th>
          <th>Prix par heure</th>
          <th colSpan={3}>Option</th>
      </tr>
      {
        formateurs.map((f,i)=>(
          <tr key={i}>
          <td> <img className='image_table' src={`${API_URL}/formateur/getimage/${f._id}`} /> </td>
          <td>{f.nom} </td>
          <td>{f.prenom} </td>
          <td>{f.email} </td>
          <td>{f.tel} </td>
          <td>{f.nbrHeur} </td>
          <td>{f.prixHeur} </td>
          <td><ImBin onClick={deleteFormateur.bind(this,f._id)}  className="Icon Icon_delete"/></td>
          <td><ImPencil onClick={updateFormateur.bind(this,f)}  className="Icon Icon_update"/></td>
          <td><AiOutlineSend onClick={emailFormateur.bind(this,f)} className="Icon Icon_email"/></td>
      </tr>
        ))
     }
      </tbody>

  </table>
  </div>

       </div>
       <br />
       <br />
         <input type="button" onClick={pagination.bind(this,-5)} value="<"  className="btn_pagination" />

{formateurs.length==5?(
         <input type="button" onClick={pagination.bind(this,+5)} value=">"  className="btn_pagination" />
       ):<input type="button" value=">"  className="btn_pagination" />
       }

       </div>
       <br />
       
    </div>
       {/* here */}
    </center>
    </div>
  </div>
  )
}

export default Formateur