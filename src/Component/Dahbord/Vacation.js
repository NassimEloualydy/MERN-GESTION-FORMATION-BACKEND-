import React,{useState,useEffect} from 'react'
import Menu from "../Menu/Menu"
import {API_URL} from "../config";
import toastr from 'toastr';
import "toastr/build/toastr.css";
import { ImBin,ImPencil,ImNotification } from "react-icons/im";
import {IoIosMenu} from "react-icons/io";
import {Bar} from "react-chartjs-2";
import Chart from 'chart.js/auto';


const Vacation=()=>{
    const [menu,setMenu]=useState(true);
    const [formulaire,setFormulaire]=useState(true);
    const [formulaireBtn,setFormulaireBtn]=useState("Ajouter");
    const [skip,setSkip]=useState(0);
    const [vacations,setVacations]=useState([]);
    const [idVacation,setIdVacation]=useState("");
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
        setVacation({
            date:"",
            nbrHeure:"",
            module:"",
            formateur:"",
            group:""
    
        });
        getAll(skip);
      }
     const [moduls,setModuls]=useState([]);
     const [groups,setGroups]=useState([]);

     const loadModels=()=>{
        fetch(`${API_URL}/vacation/loadeModules`,{
          method: "GET",
          headers:{
            "Accept":"application/json",
            "Content-Type":"application/json",
          }
        }).then(res=>res.json()).then(res=>{
            if(res.m){
                setModuls(res.m);                
            }else
            console.log(res);
        }).catch(err=>console.log(err));
     }    
     const [vacation,setVacation]=useState({
        date:"",
        nbrHeure:"",
        module:"",
        formateur:"",
        group:""
     });  
     const handleChange=(e)=>{
        const name=e.target.name;
        const value=e.target.value;
        if(name=="module"){
           fetch(`${API_URL}/vacation/getGroup/${value}`,{
            method:"GET",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            
           }).then(res=>res.json()).then(res=>{
            if(res.g){
                setGroups(res.g);
            }else
            console.log(res);
           }).catch(err=>console.log(err));           
        }
        setVacation({...vacation,[e.target.name]:e.target.value});
     }
     const submitBtn=()=>{
        if(formulaireBtn=="Ajouter"){
            fetch(`${API_URL}/vacation/add`,{
                method:"POST",
                headers:{
                    "Accept":"application/json",
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(vacation)
            }).then(res=>res.json()).then(res=>{
                 if(res.err){
                    toastr.warning(`${res.err}`,"Operation invalide !!",{positionClass:"toast-bottom-right"});
                 }
                 if(res.msg){
                    toastr.success(`${res.msg}`,"Operation valide !!",{positionClass:"toast-bottom-right"});
                    hideFormulaire();
                 }else
                 console.log(res);
                 
            }).catch(err=>console.log(err));
    
        }else{
            fetch(`${API_URL}/vacation/update/${idVacation}`,{
                method:"POST",
                headers:{
                    "Accept":"application/json",
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(vacation)
            }).then(res=>res.json()).then(res=>{
                 if(res.err){
                    toastr.warning(`${res.err}`,"Operation invalide !!",{positionClass:"toast-bottom-right"});
                 }
                 if(res.msg){
                    toastr.success(`${res.msg}`,"Operation valide !!",{positionClass:"toast-bottom-right"});
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
        fetch(`${API_URL}/vacation/getAll/${skip}`,{
            method:"POST",
            headers:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            body:JSON.stringify(search)
        }).then(res=>res.json()).then(res=>{
            if(res.v){
              setVacations(res.v);
            }else
            console.log(res);
        }).catch(err=>console.log(err));
      }
      const deleteVacation=(id)=>{
        if(window.confirm("Voulez vous vraiment supprimer cet vacation ?")==true){
            fetch(`${API_URL}/vacation/delete/${id}`,{
                method:"POST",
                headers:{
                    "Accept":"application/json",
                    "Content-Type":"application/json"
                }
            }).then(res=>res.json()).then(res=>{
                if(res.msg){
          toastr.success(`${res.msg}`,"Operation valide",{positionClass:"toast-bottom-right"});
                    getAll(skip);
                }else
                console.log(res);
            }).catch(err=>console.log(err));
        }
      }
      const updateVacation=(v)=>{
        setIdVacation(v._id)
        showFormulaire();
        setFormulaireBtn("Moddifier");
        setVacation({
            date:v.date,
            nbrHeure:v.nbrHeure,
            module:v.module[0]._id,
            group:v.group[0]._id
        })

      }
      const [search,setSearch]=useState({
        date:"",
        nbrHeure:"",
        module:"",
        group:""

      });
    const handleChangeSearch=(e)=>{
      const name=e.target.name;
      const value=e.target.value;
      setSearch({...search,[name]:value});
    }
    const btnSearch=()=>{
      getAll(skip);
     }
     const detailVacation=(v)=>{
      setDetailForm(false);
      setDetailsVacation(v);
      
     
    }
     const hideDetailCard=()=>{
      setDetailForm(true);
     }
     const [detailForm,setDetailForm]=useState(true);
     const [detailsVacation,setDetailsVacation]=useState(
      {_id:"",nbrHeure:"",module:[{_id:"",nom:"",niveau:"",objectif:"",massHoraire:""}],group:[{_id:"",nom:"",annee:"",nbrEtudient:""}],date:"",formateur:[{_id:"",nom:"",prenom:"",email:"",tel:""}]}
     );
     const [nbrModuleVacationData,setNbrModuleVacationData]=useState({
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
      fetch(`${API_URL}/vacation/chart1`,{
        method:"GET",
        headers: {
          "Accept":"application/json",
          "Content-Type":"application/json"
        }
      }).then(res=>res.json()).then(res=>{
        if(res.c){
            var labels=[];
            var data=[];
            for(const d of res.c){
              labels.push(d.module[0].nom);
              data.push(d.count);
            }
            setNbrModuleVacationData({
              labels:labels,
              datasets:[{
               label:"le nombre des module pour chaque formateur",
               data:data,
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
        console.log(res.c);
      }).catch(err=>console.log(err))
    }
    const [nbrGroupVacationData,setNbrGroupVacationData]=useState({
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
const chart2=()=>{
  fetch(`${API_URL}/vacation/chart2`,{
    method:"GET",
    headers: {
      "Accept":"application/json",
      "Content-Type":"application/json"
    }
  }).then(res=>res.json()).then(res=>{
    if(res.c){
        var labels=[];
        var data=[];
        for(const d of res.c){
          labels.push(d.group[0].nom);
          data.push(d.count);
        }
        setNbrGroupVacationData({
          labels:labels,
          datasets:[{
           label:"le nombre des group pour chaque formateur",
           data:data,
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
    console.log(res.c);
  }).catch(err=>console.log(err))
}


     useEffect(()=>{
         chart2();
         chart1();
         getAll(skip);
        loadModels();        
     },[])

  return (
    <div className="containerDashbord">
    <Menu hideMenu={hideMenu} menu={menu}/>
    <div className="bodyDahbord">

    <IoIosMenu onClick={showMenu} className="IconMenu"/>
         {/* detail card */}
         <div className={detailForm?"detailForm":"showDailForm"}>
       <center>
        <h3>Les detail de vacation</h3>
        

        <div className="containerModule">
          <div className="formateur">
            <br />
            <div className="DetailItemModule formateurD">
                <div className="formateurDitem">
                  <br />
                  <img src={`${API_URL}/formateur/getimage/${detailsVacation.formateur[0]._id}`} className="DetailModuleImg" />
                </div>
                <div className="formateurDitem">
                <center>
                <h4>Formateur</h4>
              </center>
                  <br />
                  <div className="infoItemContainer">
                     <div>Nom</div>
                     <div>{detailsVacation.formateur[0].nom}</div>
                  </div>
                  <br />
                  <div className="infoItemContainer">
                     <div>Prenom</div>
                     <div>{detailsVacation.formateur[0].prenom}</div>
                  </div>
                  <br />
                  <div className="infoItemContainer">
                     <div>Email</div>
                     <div>{detailsVacation.formateur[0].email}</div>
                  </div>
                  <br />
                  <div className="infoItemContainer">
                     <div>Telephone </div>
                     <div>{detailsVacation.formateur[0].tel}</div>
                  </div>

                </div>
            </div>
            <br />
            <div className="DetailItemModule moduleV">
              <center>
                <h4>Module et vacation</h4>
              </center>
            <br />
                  <div className="infoItemContainer">
                     <div>Nom</div>
                     <div>{detailsVacation.module[0].nom}</div>
                  </div>
                  <br />
                  <div className="infoItemContainer">
                     <div>Niveau</div>
                     <div>{detailsVacation.module[0].niveau}</div>
                  </div>
                  <br />
                  <div className="infoItemContainer">
                     <div>Mass Horaire</div>
                     <div>{detailsVacation.module[0].massHoraire}</div>
                  </div>
                  <br />
                  <div className="infoItemContainer">
                     <div>Objectife</div>
                     <div>{detailsVacation.module[0].objectif}</div>
                  </div>
                  <br />
                  <div className="infoItemContainer">
                     <div>Date de vacation</div>
                     <div>{detailsVacation.date}</div>
                  </div>
                  <br />
                  <div className="infoItemContainer">
                     <div>Nombre des heure</div>
                     <div>{detailsVacation.nbrHeure}</div>
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
        <h3>Formulaire Vacation</h3>
        
        <br/>
        <div className="continer_input_formulaire">
          <div>Date: </div>
          <input type="text" onChange={handleChange} name="date"  value={vacation.date} className="inputFormulaire" />
        </div>
        <br/>
        <div className="continer_input_formulaire">
          <div>Nombre des heure: </div>
          <input type="text" name="nbrHeure" onChange={handleChange} value={vacation.nbrHeure} className="inputFormulaire" />
        </div>

        <br />
        <div className="continer_input_formulaire">
          <div>Module: </div>
          <select name="module" onChange={handleChange} value={vacation.module} className="inputFormulaire">
          <option value="">Choisire un module</option>
            {moduls.map((m,i)=>(
           <option key={i} value={m._id}>{m.nom}</option>
            ))};
          </select>
        </div>
        <br />
        <div className="continer_input_formulaire">
          <div>Group: </div>
          <select name="group" onChange={handleChange} value={vacation.group} className="inputFormulaire">
           <option value="">Choisire un niveau</option>
           {/* groups */}
           {groups.map((g,i)=>(
           <option key={i} value={g._id}>{g.nom}</option>
            ))};

          </select>
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
      <Bar data={nbrModuleVacationData}/>
        </center>
      </div>
      <br />
      <div className="barItem">
        <center>
          <h3>le nombre des module pour chaque niveau</h3>
      <Bar data={nbrGroupVacationData}/>
        </center>
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
                 <input type="text" name="date" placeholder='date'  onChange={handleChangeSearch}    className="inputSearch" /><br /><br />
                 <input type="text" name="nbrHeure" onChange={handleChangeSearch}  placeholder='Nombre des heure'   className="inputSearch" />
          </div>
          <br />
          <div className="contianerInputSearch">
          <input type="text" name="module" placeholder='nom de module'  onChange={handleChangeSearch}    className="inputSearch" /><br /><br />
          <input type="text" name="group" onChange={handleChangeSearch}  placeholder='nom de group'   className="inputSearch" />
          </div>
          <br />
          <input type="Button" value="Chercher" onClick={btnSearch} className="inputBtnSearch" />

        </center>
      </div>
     <input type="Button" value="Novelle" onClick={showFormulaire} className="btn_mewItem" />
     <br />
     <br />
     
     <div className='tableList'>
     <table>
      <tbody>
 
      <tr id="header">
          <th colSpan={2}>Formateur</th>
          <th>Module</th>
          <th>Niveau</th>
          <th>Group</th>
          <th>Date</th>
          <th>Nombre des heure</th>
          <th colSpan={3}>Option</th>
      </tr>
      
      {
        vacations.map((v,i)=>(
          <tr key={i}>
          <td> <img className='image_table' src={`${API_URL}/formateur/getimage/${v.formateur[0]._id}`} /> </td>
          <td>{v.formateur[0].nom+" "+v.formateur[0].prenom} </td>
          <td>{v.module[0].nom} </td>
          <td>{v.module[0].niveau} </td>
          <td>{v.group[0].nom} </td>
          <td>{v.date} </td>
          <td>{v.nbrHeure} </td>
          <td><ImBin onClick={deleteVacation.bind(this,v._id)} className="Icon Icon_delete"/></td>
          <td><ImPencil onClick={updateVacation.bind(this,v)} className="Icon Icon_update"/></td>
          <td><ImNotification onClick={detailVacation.bind(this,v)} className="Icon Icon_details"/></td>

      </tr>

        ))
    } 
      </tbody>

  </table>
  </div>

       </div>
       <br />
         <input type="button" onClick={pagination.bind(this,-5)} value="<"  className="btn_pagination" />

{vacations.length==5?(
         <input type="button" onClick={pagination.bind(this,+5)} value=">"  className="btn_pagination" />
       ):<input type="button" value=">"  className="btn_pagination" />
       }


       </div>
       <br />
       
    </div>
       {/* here */}
    </center>
    </div>
  </div>  )
}

export default Vacation;