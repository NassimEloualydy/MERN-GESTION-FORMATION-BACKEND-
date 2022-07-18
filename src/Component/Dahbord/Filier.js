import React,{useState,useEffect} from 'react'
import {IoIosMenu} from "react-icons/io";
import Menu from "../Menu/Menu"
import {API_URL} from "../config";
import toastr from 'toastr';
import "toastr/build/toastr.css";
import { ImBin,ImPencil,ImNotification } from "react-icons/im";
const Filier=()=>{
    const [menu,setMenu]=useState(true);
    const [formulaire,setFormulaire]=useState(true);
    const [formulaireBtn,setFormulaireBtn]=useState("Ajouter");
    const [filiers,setFiliers]=useState([]);
    const [skip,setSkip]=useState(0);
    const [idFilier,setIdFilier]=useState();
    const [nbrEtudientMax,setNbrEtudientMax]=useState(0);
    const [searchFilier,setSearchFilier]=useState({
      nom:"",
      niveau:"",
      nbrEtudientMax:"",
      nbrAnnee:""

    });
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
      setFilier({
        nom:"",
              niveau:"",
              nbrEtudientMax:"",
              nbrAnnee:""
      });
      setFormulaireBtn("Ajouter");
    }
    const [filier,setFilier]=useState({
              nom:"",
              niveau:"",
              nbrEtudientMax:"",
              nbrAnnee:""
    });
    const handleChange=(e)=>{
      setFilier({...filier,[e.target.name]:e.target.value});
    }
    const submitFilier=()=>{
      if(formulaireBtn=="Ajouter"){
        fetch(`${API_URL}/filier/add`,{
          method:"POST",
          headers:{
            "Accept":"application/json",
            "Content-Type":"application/json"
          },
          body:JSON.stringify(filier)
        }).then(res=>res.json()).then(res=>{
          if(res.err){
             toastr.warning(`${res.err}`,"Operation invalide !!",{positionClass:"toast-bottom-right"});
          }
          if(res.msg){
            toastr.success(`${res.msg}`,"Operation valide !!",{positionClass:"toast-bottom-right"});
            hideFormulaire();
            getAll(skip);
          }else{
            console.log(res);
          }
        }).catch(err=>console.log(err));
  
      }else{
        fetch(`${API_URL}/filier/updateFilier/${idFilier}`,{
          method:"POST",
          headers:{
            "Accept":"application/json",
            "Content-Type":"application/json"
          },
          body:JSON.stringify(filier)
        }).then(res=>res.json()).then(res=>{
          if(res.err){
            toastr.warning(`${res.err}`,"Operation invalide !!",{positionClass:"toast-bottom-right"});
          }
          if(res.msg){
            toastr.success(`${res.msg}`,"Operation valide !!",{positionClass:"toast-bottom-right"});
            hideFormulaire();
            getAll(skip);
          }else{
            console.log(res)
          }
        }).catch(err=>console.log(err));
      }
    }
    const getAll=(p)=>{
      fetch(`${API_URL}/filier/getall/${p}`,{
        method:"POST",
        headers:{
          "Accept":"application/json",
          "Content-Type":"application/json"
        },
        body:JSON.stringify(searchFilier)
      }).then(res=>res.json()).then(res=>{
        if(res.f.length>0){          
          setFiliers(res.f)
        }else{
          setSkip(skip-5);
        }
        
      }).catch(err=>console.log(err));
    }
    const pagination=(pa)=>{      
      if(skip+pa>=0){
       setSkip(skip+pa)
       getAll(skip+pa)
      }
    }
    const deleteFilier=(id)=>{
      if(window.confirm("Vouler vous vraiment supprimer cet filier "))
      fetch(`${API_URL}/filier/deleteFilier/${id}`,{
        method:"DELETE",
        headers:{
          "Accept":"application/json",
          "Content-Type":"application/json"
        }
      }).then(res=>res.json()).then(res=>{
        if(res.msg){
           toastr.success(`${res.msg}`,"Operation valide !!",{positionClass:"toast-bottom-right"});
           getAll(skip);
        }else{
          console.log(res)
        }
      }).catch(err=>console.log(err))
    }
    const updateFilier=(f)=>{
      showFormulaire();
      setFormulaireBtn("Moddifier");
      setFilier({
              nom:f.nom,
              niveau:f.niveau,
              nbrEtudientMax:f.nbrEtudientMax,
              nbrAnnee:f.nbrAnnee
      });
      setIdFilier(f._id);
    }
    const handleChangeSearch=(e)=>{
      setSearchFilier({...searchFilier,[e.target.name]:e.target.value})
    }
    const search=()=>{
      fetch(`${API_URL}/filier/search/${skip}`,{
        method:"POST",
        headers:{
          "Accept":"application/json",
          "Content-Type":"application/json"
        },
        body:JSON.stringify(searchFilier)
      }).then(res=>res.json()).then(res=>{
        if(res.f)
        setFiliers(res.f);
        else
        console.log(res);
      }).catch(err=>console.log(err));
    }
    const nbrEtudient=()=>{
      fetch(`${API_URL}/filier/nbrEtudient`,{
        mehod:"GET",
        headers:{
          "Accept":"application/json",
          "Content-Type":"application/json"
        }
      }).then(res=>res.json()).then(res=>{
        if(res.f){
          var c=0;
          res.f.forEach(f => {
           c=c+parseInt(f.nbrEtudientMax)            
          });          
          setNbrEtudientMax(c);
        }else
        console.log(res);
      }).catch(err=>console.log(err))
    }
    const [nbrFilierDistinct,setNbrFilierDistinct]=useState(0);

    const getNbrFilierDistinct=()=>{
      fetch(`${API_URL}/filier/distinctFilier`,{
        method:"GET",
        headers:{
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      }).then(res=>res.json()).then(res=>{
        if(res.f){
          setNbrFilierDistinct(res.f.length);
        }else{
          console.log(res);
        }
      }).catch(err=>console.log(err));
    }
    const [totaleFilier,setTotaleFilier]=useState(0);
    const totaleFiliere=()=>{
      fetch(`${API_URL}/filier/totaleFilier`,{
        method:"GET",
        headers:{
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      }).then(res=>res.json()).then(res=>{
        if(res.f){
          setTotaleFilier(res.f.length);
        }else{
          console.log(res);
        }
      }).catch(err=>console.log(err));
    }
    useEffect(()=>{
      totaleFiliere();
      getNbrFilierDistinct();
      nbrEtudient();
      getAll(skip);
    },[])
    return (
    <div className="containerDashbord">
      <Menu hideMenu={hideMenu} menu={menu}/>
      <div className="bodyDahbord">

      <IoIosMenu onClick={showMenu} className="IconMenu"/>
      <div className={formulaire?"formulaire":"showFormulaire"}>
        <center>
          <h3>Formulaire Filier</h3>
          <br/>
          <div className="continer_input_formulaire">
            <div>Nom: </div>
            <input type="text" name="nom" onChange={handleChange} value={filier.nom} className="inputFormulaire" />
          </div>
          <br />
          <div className="continer_input_formulaire">
            <div>Niveau: </div>
            <select name="niveau" onChange={handleChange} value={filier.niveau} className="inputFormulaire">
             <option value="">Choisire un niveau</option>
             <option value="S1">S1</option>
             <option value="S2">S2</option>
             <option value="S3">S3</option>
             <option value="S4">S4</option>
             <option value="S5">S5</option>
             <option value="S6">S6</option>
            </select>
          </div>
<br />
           <div className="continer_input_formulaire">
            <div>Nombre Etudient Maximale: </div>
            <input type="text" name="nbrEtudientMax" onChange={handleChange} value={filier.nbrEtudientMax} className="inputFormulaire" />
           </div>
           <br />
           <div className="continer_input_formulaire">
            <div>Nombre Des Annee: </div>
            <input type="text" name="nbrAnnee" onChange={handleChange} value={filier.nbrAnnee} className="inputFormulaire" />
           </div>

          <br/>
          <input type="button" value={formulaireBtn} onClick={submitFilier} className='inputBtnFormulaire' />&nbsp;
          <input type="button" value="Annuler" onClick={hideFormulaire} className='inputBtnFormulaire' />
        </center>
      </div>
      <center>
        <br />
        <br />
        <h3 className="title_chart">Les statestic</h3>
      <div className="containet_chart">
          <div className="chart_item">
            <div className="container_chart_item">
              <h3>Totale :</h3>
              <p>{totaleFilier}</p>
            </div>
          </div>
          <div className="chart_item">
            <div className="container_chart_item">
            <h3>Totale des etudient :</h3>
              <p>{nbrEtudientMax}</p>

            </div>
          </div>
          <div className="chart_item">
            <div className="container_chart_item">
            <h3>Les déférent filier :</h3>
              <p>{nbrFilierDistinct}</p>

            </div>
          </div>
      </div>
      <br />
      <div className="container_list">

     <div className="list">
      <div className="list_table">
        <div className="bar_recherch">
          <center>
            <h3>La bare de recherch</h3>
            <div className="contianerInputSearch">
                   <input type="text" name="nom" placeholder='nom' id="" value={searchFilier.nom} onChange={handleChangeSearch}  className="inputSearch" /><br /><br />
                   <select  name="niveau" onChange={handleChangeSearch}    className="inputSearch selectInput">
             <option value="">Choisire un niveau</option>
             <option value="S1">S1</option>
             <option value="S2">S2</option>
             <option value="S3">S3</option>
             <option value="S4">S4</option>
             <option value="S5">S5</option>
             <option value="S6">S6</option>
             
            </select>
            </div>
            <br />
            <div className="contianerInputSearch">
                   <input type="text" name="nbrEtudientMax" placeholder='Nombre Etudient'  value={searchFilier.nbrEtudientMax} onChange={handleChangeSearch} className="inputSearch" /><br /><br />
                   <input type="text" name="nbrAnnee" placeholder='Nombre des annee' value={searchFilier.nbrAnnee} onChange={handleChangeSearch} className="inputSearch" />
            </div>
            <br />
            <input type="Button" value="Chercher" onClick={search} className="inputBtnSearch" />

          </center>
        </div>
       <input type="Button" value="Novelle" onClick={showFormulaire} className="btn_mewItem" />
       <br />
       <br />
       <div className='tableList'>

       <table >
        <tbody>
   
        <tr id="header">
            <th>Nom</th>
            <th>Niveau</th>
            <th>N Etudient</th>
            <th>N Annee</th>
            <th colSpan={2}>Option</th>
        </tr>
        
        {
          filiers.map((f,i)=>(
            <tr key={i}>
            <td>{f.nom} </td>
            <td>{f.niveau} </td>
            <td>{f.nbrEtudientMax} </td>
            <td>{f.nbrAnnee} </td>
            <td><ImBin onClick={deleteFilier.bind(this,f._id)}  className="Icon Icon_delete"/></td>
            <td><ImPencil onClick={updateFilier.bind(this,f)}  className="Icon Icon_update"/></td>
        </tr>

          ))
        }
        </tbody>

    </table>
    </div>

         </div>
         <br />
           <input type="button" onClick={pagination.bind(this,-5)} value="<"  className="btn_pagination" />

{filiers.length==5?(
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

export default Filier;