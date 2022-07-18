import React,{useState,useEffect} from 'react'
import Menu from "../Menu/Menu";
import {API_URL} from "../config";
import toastr from 'toastr';
import "toastr/build/toastr.css";
import { ImBin,ImPencil,ImNotification } from "react-icons/im";
import {IoIosMenu} from "react-icons/io";
import {Bar} from "react-chartjs-2";
import Chart from 'chart.js/auto';

const  Module=()=>{
    const [menu,setMenu]=useState(true);
    const [formulaire,setFormulaire]=useState(true);
    const [formulaireBtn,setFormulaireBtn]=useState("Ajouter");
    const [formateur,setFormateur]=useState([]);
    const [idModule,setIdModule]=useState("");
    const [skip,setSkip]=useState(0);
    const [modules,setModules]=useState([]);
    const [module,setModule]=useState({
        nom:"",
        formateur:"",
        niveau:"",
        objectif:"",
        massHoraire:""
    });
    const handleChange=(e)=>{
        setModule({...module,[e.target.name]:e.target.value});
    }
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
        getAll(skip);
        setFormulaire(true);
        setFormulaireBtn("Ajouter");
        setModule({
            nom:"",
            formateur:"",
            niveau:"",
            objectif:"",
            massHoraire:""    
        })
      }
      const loadFormateur=()=>{
        fetch(`${API_URL}/module/getFormateur`,{
            method:"GET",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            }
        }).then(res=>res.json()).then(res=>{
            if(res.f)
              setFormateur(res.f);
            else
            console.log(res);
        }).catch(err=>console.log(err));
      }  
      const submitBtn=()=>{
        if(formulaireBtn=="Ajouter"){

        fetch(`${API_URL}/module/submit`,{
          method:"POST",
          headers:{
            "Accept":"application/json",
            "Content-Type":"application/json"
          },
          body:JSON.stringify(module)
        }).then(res=>res.json()).then(res=>{
            if(res.err)
            toastr.warning(`${res.err}`,"Operation invalide",{positionClass:"toast-bottom-right"});
            if(res.msg){
                toastr.success(`${res.msg}`,"Operation valide",{positionClass:"toast-bottom-right"});
                hideFormulaire();
            }else
            console.log(res);
        }).catch(err=>console.log(err));
      }else{
      fetch(`${API_URL}/module/update/${idModule}`,{
        method:"POST",
        headers:{
          "Accept":"application/json",
          "Content-Type":"application/json"
        },
        body:JSON.stringify(module)
      }).then(res=>res.json()).then(res=>{
          if(res.err)
          toastr.warning(`${res.err}`,"Operation invalide",{positionClass:"toast-bottom-right"});
          if(res.msg){
              toastr.success(`${res.msg}`,"Operation valide",{positionClass:"toast-bottom-right"});
              hideFormulaire();
          }else
          console.log(res);
      }).catch(err=>console.log(err));
    }
      }
      const pagination=(pa)=>{      
        if(skip+pa>=0){
         setSkip(skip+pa);
         getAll(skip+pa);
        }
      }
     const getAll=(skip)=>{
      fetch(`${API_URL}/module/getAll/${skip}`,{
        method:"POST",
        headers:{
          "Accept":"application/json",
          "Content-Type":"application/json"
        },
        body:JSON.stringify(moduleSearch)
      }).then(res=>res.json()).then(res=>{
        if(res.m){
          setModules(res.m);
        }else
        console.log(res);
        console.log(res);
      }).catch(err=>console.log(err));
     }
     const deleteModule=(id)=>{
      fetch(`${API_URL}/module/delete/${id}`,{
       method:"DELETE",
       headers:{
        "Accept":"application/json",
        "Content-Type":"application/json"
       }
      }).then(res=>res.json()).then(res=>{
        if(res.msg){
          toastr.success(`${res.msg}`,"Operation valide",{positionClass:"toast-bottom-right"});
          hideFormulaire();
        }else
        console.log(res);
      }).catch(err=>console.log(err));
     }
     const updateModule=(m)=>{
      setModule({
        nom:m.nom,
        formateur:"",
        niveau:m.niveau,
        objectif:m.objectif,
        massHoraire:m.massHoraire
      });
      showFormulaire();
      setFormulaireBtn("Moddifier");
      setIdModule(m._id);
     }
     const [detailForm,setDetailForm]=useState(true);
     const [detailModule,setDetailModule]=useState({m:{
      formateur: {nom:"",prenom:"",email:"",tel:"",_id:""},
      massHoraire: "1",
      niveau: "S1",
      nom: "1",
      objectif: "12"
     }
      
     });
     const detailEtudient=(m)=>{
      setDetailForm(false);
      setDetailModule({m});
     }
     const hideDetailCard=()=>{
      setDetailForm(true);
     }
     const [moduleSearch,setModuleSearch]=useState({
      nom:"",
      formateur:"",
      niveau:"",
      objectif:"",
      massHoraire:""    
     })
      const handleChangeSearch=(e)=>{
        setModuleSearch({...moduleSearch,[e.target.name]:e.target.value});
      }
      const searchBtn=()=>{
        getAll(skip);
      }
      const [nbrModuleFormateurData,setNbrModuleFormateurData]=useState({
        labels:[],
        datasets:[{
         label:"le nombre des module pour chaque formateur",
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

const [nbrModuleNiveauData,setNbrModuleNiveauData]=useState({
  labels:[],
  datasets:[{
   label:"le nombre des module pour chaque formateur",
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

const chart1=()=>{
    
        fetch(`${API_URL}/module/chart1`,{
          method:"GET",
          headers:{
            "Accept": "application/json",
            "Content-Type":"application/json"
          }
        }).then(res=>res.json()).then(res=>{
          if(res.c){
           const data1=[];
           const count1=[];
      
              for(const d of res.c){
                 data1.push(d.formateur[0].nom+" "+d.formateur[0].prenom)
                 count1.push(parseInt(d.count));
              }
              setNbrModuleFormateurData({
                labels:data1,
                datasets:[{
                 label:"le nombre des module pour chaque formateur",
                 data:count1,
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
          }else
          console.log(res);
        }).catch(err=>console.log(err));
      }
      const chart2=()=>{
        fetch(`${API_URL}/module/chart2`,{
          method:"GET",
          headers:{
            "Accept":"application/json",
            "Content-Type":"application/json"
          }
        }).then(res=>res.json()).then(res=>{
          setNbrModuleNiveauData({

          });
          if(res.c){
            const data1=[];
            const count1=[];
       
               for(const d of res.c){
                  data1.push(d._id)
                  count1.push(parseInt(d.count));
               }
               setNbrModuleNiveauData({
                 labels:data1,
                 datasets:[{
                  label:"le nombre des module pour chaque niveau",
                  data:count1,
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
           }else
           console.log(res);
 
        }).catch(err=>console.log(err));
      }
     useEffect(()=>{
      chart2();
       getAll(skip);
       loadFormateur();
       chart1();
     },[]);
     
  return (
    <div className="containerDashbord">
    <Menu hideMenu={hideMenu} menu={menu}/>
    <div className="bodyDahbord">

    <IoIosMenu onClick={showMenu} className="IconMenu"/>
     {/* detail card */}
     <div className={detailForm?"detailForm":"showDailForm"}>
       <center>
        <h3>Les detail de etudient</h3>
        

        <div className="containerModule">
          <div className="formateur">
            <br />
            <div className="DetailItemModule formateurD">
                <div className="formateurDitem">
                  <br />
                  <img src={`${API_URL}/formateur/getimage/${detailModule.m.formateur._id}`} className="DetailModuleImg" />
                </div>
                <div className="formateurDitem">
                <center>
                <h4>Formateur</h4>
              </center>
                  <br />
                  <div className="infoItemContainer">
                     <div>Nom</div>
                     <div>{detailModule.m.formateur.nom}</div>
                  </div>
                  <br />
                  <div className="infoItemContainer">
                     <div>Prenom</div>
                     <div>{detailModule.m.formateur.prenom}</div>
                  </div>
                  <br />
                  <div className="infoItemContainer">
                     <div>Email</div>
                     <div>{detailModule.m.formateur.email}</div>
                  </div>
                  <br />
                  <div className="infoItemContainer">
                     <div>Telephone </div>
                     <div>{detailModule.m.formateur.tel}</div>
                  </div>

                </div>
            </div>
            <br />
            <div className="DetailItemModule moduleD">
              <center>
                <h4>Module</h4>
              </center>
            <br />
                  <div className="infoItemContainer">
                     <div>Nom</div>
                     <div>{detailModule.m.nom}</div>
                  </div>
                  <br />
                  <div className="infoItemContainer">
                     <div>Niveau</div>
                     <div>{detailModule.m.niveau}</div>
                  </div>
                  <br />
                  <div className="infoItemContainer">
                     <div>Mass Horaire</div>
                     <div>{detailModule.m.massHoraire}</div>
                  </div>
                  <br />
                  <div className="infoItemContainer">
                     <div>Objectife</div>
                     <div>{detailModule.m.objectif}</div>
                  </div>

            </div>
          </div>
        </div>
        <br />
        <input type="button" value="Reteur" onClick={hideDetailCard} className='inputBtnFormulaire' />
       </center>
      </div>|
    {/* detail card */}
   
    <div className={formulaire?"formulaire":"showFormulaire"}>
      <center>
        <h3>Formulaire Module</h3>
        
        <br/>
        <div className="continer_input_formulaire">
          <div>Nom: </div>
          <input type="text" name="nom"  onChange={handleChange} value={module.nom} className="inputFormulaire" />
        </div>
        <br />
        <div className="continer_input_formulaire">
          <div>Formateur: </div>
          <select name="formateur"  onChange={handleChange} value={module.formateur} className="inputFormulaire">
           <option value="">Choisire un formateur</option>
           {formateur.map((f,i)=>(
            <option key={i} value={f._id}>{f.nom} {f.prenom}</option>
           ))}
          </select>
        </div>
<br />
        <div className="continer_input_formulaire">
          <div>Niveau: </div>
          <select name="niveau"  onChange={handleChange} value={module.niveau} className="inputFormulaire">
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
          <div>Objectife: </div>
          <input type="text" name="objectif"   onChange={handleChange} value={module.objectif} className="inputFormulaire" />
         </div>

        <br/>

         <div className="continer_input_formulaire">
          <div>Mass Horraire: </div>
          <input type="text" name="massHoraire"   onChange={handleChange} value={module.massHoraire} className="inputFormulaire" />
         </div>
         <br />
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
          <h3>le nombre des module pour chaque formateur</h3>
      <Bar data={nbrModuleFormateurData}/>
        </center>
      </div>
      <br />
      <div className="barItem">
        <center>
          <h3>le nombre des module pour chaque niveau</h3>
      <Bar data={nbrModuleNiveauData}/>
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
                 <input type="text" name="nom" placeholder='Nom'  onChange={handleChangeSearch}    className="inputSearch" /><br /><br />
                 <input type="text" name="massHoraire" onChange={handleChangeSearch}  placeholder='Mass horaire'   className="inputSearch" />
          </div>
          <br />
          <div className="contianerInputSearch">
          <select  name="niveau" onChange={handleChangeSearch}    className="inputSearch selectInput">
             <option value="">Choisire un niveau</option>
             <option value="S1">S1</option>
             <option value="S2">S2</option>
             <option value="S3">S3</option>
             <option value="S4">S4</option>
             <option value="S5">S5</option>
             <option value="S6">S6</option>
             
            </select><br /><br />
            
            <select name="formateur"  onChange={handleChangeSearch}   value={module.formateur} className="inputSearch selectInput">
           <option value="">Choisire un formateur</option>
           {formateur.map((f,i)=>(
            <option key={i} value={f._id}>{f.nom} {f.prenom}</option>
           ))}
          </select>

          </div>
          <br />
          <div className="contianerInputSearch">
                 <input type="text" name="objectif"  onChange={handleChangeSearch} placeholder='objectif'   className="inputSearch" />
          </div>
<br />
          <input type="Button" value="Chercher"   onClick={searchBtn} className="inputBtnSearch" />

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
          <th>Formateur</th>
          <th>Module</th>
          <th>Mass Horaire</th>
          <th>Niveau</th>
          <th>Objectif</th>
          <th colSpan={3}>Option</th>
      </tr>
      {
        modules.map((m,i)=>(
          <tr key={i}>
          <td> <img className='image_table' src={`${API_URL}/formateur/getimage/${m.formateur._id}`} /> </td>
          <td>{m.formateur.nom} {m.formateur.prenom} </td>
          <td>{m.nom} </td>
          <td>{m.massHoraire} </td>
          <td>{m.niveau} </td>
          <td>{m.objectif} </td>
          <td><ImBin onClick={deleteModule.bind(this,m._id)} className="Icon Icon_delete"/></td>
          <td><ImPencil onClick={updateModule.bind(this,m)} className="Icon Icon_update"/></td>
          <td><ImNotification onClick={detailEtudient.bind(this,m)} className="Icon Icon_details"/></td>

      </tr>

        ))
    } 
      </tbody>

  </table>
  </div>

       </div>
       <br />
         <input type="button" onClick={pagination.bind(this,-5)} value="<"  className="btn_pagination" />

{modules.length==5?(
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

export default Module