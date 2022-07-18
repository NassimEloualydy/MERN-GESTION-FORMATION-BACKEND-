import React,{useState,useEffect} from 'react'
import Menu from "../Menu/Menu"
import {API_URL} from "../config";
import toastr from 'toastr';
import "toastr/build/toastr.css";
import { ImBin,ImPencil,ImNotification } from "react-icons/im";
import {IoIosMenu} from "react-icons/io";
import {Bar,Doughnut,Bubble} from "react-chartjs-2";
import Chart from 'chart.js/auto';

const Group=()=>{
    const [menu,setMenu]=useState(true);
    const [formulaire,setFormulaire]=useState(true);
    const [formulaireBtn,setFormulaireBtn]=useState("Ajouter");
    const [skip,setSkip]=useState(0);
    const [idGroup,setIdGroup]=useState("");
    const [detailForm,setDetailForm]=useState(true);
    
    const [group,setGroup]=useState({
      nom:"",
      annee:"",
      nbrEtudient:"",
      niveau:"",
      filier:""
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
        setFormulaireBtn("Ajouter");
        setGroup({
          nom:"",
          annee:"",
          nbrEtudient:"",
          niveau:"",
          filier:""
        });
      }
      const [filier,setFilier]=useState([]);
      const handleChange=(e)=>{
        var name=e.target.name;
        var value=e.target.value;
        if(value=="" && name=="niveau")
        setFilier([]);
        if(name=="niveau" && value!=""){
           fetch(`${API_URL}/group/getFilier/${value}`,{
           method:"GET",
           headers:{
            "Accept":"application/json",
            "Content-Type":"application/json"
           }
          }).then(res=>res.json()).then(res=>{
            if(res.f)
            setFilier(res.f);
            else
            console.log(res);
          }).catch(err=>console.log(err));
        }
        setGroup({...group,[e.target.name]:e.target.value});
      }
      const pagination=(pa)=>{      
        if(skip+pa>=0){
         setSkip(skip+pa)
         getAll(skip+pa)
        }
      }
  
       const submitBtn=()=>{
        if(formulaireBtn=="Ajouter"){
        fetch(`${API_URL}/group/add`,{
          method:"POST",
          headers:{
            "Accept":"application/json",
            "Content-Type":"application/json"
          },
          body:JSON.stringify(group)
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
        }).catch(err=>console.log(err))
      }
       if(formulaireBtn=="Moddifier")
       {
        fetch(`${API_URL}/group/update/${idGroup}`,{
          method:"POST",
          headers:{
            "Accept":"application/json",
            "Content-Type":"application/json"
          },
          body:JSON.stringify(group)
        }).then(res=>res.json()).then(res=>{
          if(res.err)
          toastr.warning(`${res.err}`,"Operation invalide !!",{positionClass:"toast-bottom-right"});
          if(res.msg){
            toastr.success(`${res.msg}`,"Operation valide !!",{positionClass:"toast-bottom-right"});
            hideFormulaire();
            getAll(skip);
          }else
          console.log(res);
          
        }).catch(err=>console.log(err));
       }
       }
       const [groups,setGroups]=useState([]);
       const getAll=(p)=>{
        fetch(`${API_URL}/group/getall/${p}`,{
          method:"POST",
          headers:{
            "Accept":"application/json",
            "Content-Type":"application/json"
          },
           body:JSON.stringify(searchGroup)
        }).then(res=>res.json()).then(res=>{
          if(res.g.length>0){          
            setGroups(res.g)
          }else{
            setSkip(skip-5);
          }
        }).catch(err=>console.log(err));
      }
      const deleteGroup=(id)=>{
        if(window.confirm("Voulez vous vraiment supprimet cet group ?")==true)
        fetch(`${API_URL}/group/delete/${id}`,{
          method:"DELETE",
          headers:{
            "Accept":"application/json",
            "Content-Type":"application/"

          }
        }).then(res=>res.json()).then(res=>{
          if(res.msg){
            toastr.success(`${res.msg}`,"Operation valide !!",{positionClass:"toast-bottom-right"});
            getAll(skip);
          }else{
            console.log(res);
          }           
        }).catch(err=>console.log(err));
       }
       const updateGroup=(g)=>{
        setIdGroup(g._id);
          setGroup({
              nom:g.nom,
              annee:g.annee,
              nbrEtudient:g.nbrEtudient,
              niveau:g.niveau
          });
          showFormulaire();
          setFormulaireBtn("Moddifier");
          fetch(`${API_URL}/group/getFilier/${g.niveau}`,{
            method:"GET",
            headers:{
             "Accept":"application/json",
             "Content-Type":"application/json"
            }
           }).then(res=>res.json()).then(res=>{
             if(res.f)
             setFilier(res.f);
             else
             console.log(res);
           }).catch(err=>console.log(err));
         
 
       }
       const [detailGroup,setDetailGroup]=useState({
        filier:{nom:"",nbrAnnee:"",nbrEtudientMax:""},
        nom:"",
        niveau:"",
        annee:"",
        nbrEtudient:""
       });
       const detailFilier=(g)=>{
        setDetailGroup(g);
        setDetailForm(false);
       }
       const hideDetailCard=()=>{
        setDetailForm(true);
       }
       const [searchGroup,setSearchGroup]=useState({
        nom:"",
        annee:"",
        nbrEtudient:"",
        niveau:"",
        filier:""
      });
  
       const handleChangeSearch=(e)=>{
        var name=e.target.name;
        var value=e.target.value;
        if(value=="" && name=="niveau")
        setFilier([]);
        if(name=="niveau" && value!=""){
           fetch(`${API_URL}/group/getFilier/${value}`,{
           method:"GET",
           headers:{
            "Accept":"application/json",
            "Content-Type":"application/json"
           }
          }).then(res=>res.json()).then(res=>{
            if(res.f)
            setFilier(res.f);
            else
            console.log(res);
          }).catch(err=>console.log(err));
        }
        setSearchGroup({...searchGroup,[e.target.name]:e.target.value});

       }
       const searchBtn=()=>{
        getAll(skip);
       }

       
       var count=[];
       var filierData=[];
       var nbrGroup=[];
       var Annee=[];
       const [groupData,setGroupData]=useState({
        labels:filierData,
        datasets:[{
            label:"Nombre des group pour chaque filier",
            data:count,
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
   const [anneeData,setAnneeData]=useState({
     labels:Annee,
     datasets:[{
      label:"Nombre des Group pour chaque annee",
      data:nbrGroup,
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
    const getChart2=()=>{
      fetch(`${API_URL}/group/chart2`,{
        method:"GET",
        headers:{
          "Accept":"application/json",
          "Content-Type":"application/json"
        }
      }).then(res=>res.json()).then(res=>{
        if(res.f){
          nbrGroup=[];
          Annee=[];
          for(const data of res.f){
          Annee.push(data._id);
          nbrGroup.push(data.count); 
          }
                    setAnneeData({
                      labels:Annee,
                      datasets:[{
                       label:"Nombre des Group pour chaque annee",
                       data:nbrGroup,
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
    const  getChart1=()=>{
      fetch(`${API_URL}/group/chart1`,{
        method:"GET",
        headers:{
          "Accept":"application/json",
          "Content-Type": "application/json"
        }
      }).then(res=>res.json()).then(res=>{
        count=[];
        filierData=[];
        for(const data of res.f){
          count.push(data.count);
          filierData.push(data.filier[0].nom);
        }
        setGroupData({
          labels:filierData,
          datasets:[{
            label:"Nombre des group pour chaque filier",
              data:count,
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
        // console.log(groupData);
        
      }).catch(err=>console.log(err));
    }
    
       useEffect(()=>{
        getChart2();
        getChart1();
         getAll(skip);
       },[])
  return (
    <div className="containerDashbord">
    <Menu hideMenu={hideMenu} menu={menu}/>
    <div className="bodyDahbord">

    <IoIosMenu onClick={showMenu} className="IconMenu"/>
    {/* detail form */}
      <div className={detailForm?"detailForm":"showDailForm"}>
       <center>
        <h3>Les detail de Group</h3>
        <div className="containerDetail">
        <div className="conatinerInputDetail">
          <div><h3>Nom Filiere: </h3></div>
          <div>{detailGroup.filier.nom}</div>
        </div>
        <div className="conatinerInputDetail">
          <div><h3>Nombre des annee d'etude : </h3></div>
          <div>{detailGroup.filier.nbrAnnee}</div>
        </div>
        <div className="conatinerInputDetail">
          <div><h3>Nombre des etudient maxiamle : </h3></div>
          <div>{detailGroup.filier.nbrEtudientMax}</div>
        </div>

        <div className="conatinerInputDetail">
          <div><h3>Nom Group: </h3></div>
          <div>{detailGroup.nom}</div>
        </div>
        <div className="conatinerInputDetail">
          <div><h3>Niveau: </h3></div>
          <div>{detailGroup.niveau}</div>
        </div>
        <div className="conatinerInputDetail">
          <div><h3>Nombre des etudient: </h3></div>
          <div>{detailGroup.nbrEtudient}</div>
        </div>
        <div className="conatinerInputDetail">
          <div><h3>Annee : </h3></div>
          <div>{detailGroup.annee}</div>
        </div>

        </div>
        <br />
        <input type="button" value="Reteur" onClick={hideDetailCard} className='inputBtnFormulaire' />
       </center>
      </div>|
    {/* end detail form */}
    <div className={formulaire?"formulaire":"showFormulaire"}>
      <center>
        <h3>Formulaire Group</h3>
        <br/>
        <br/>
        <div className="continer_input_formulaire">
          <div>Nom: </div>
          <input type="text"  name="nom" onChange={handleChange}  value={group.nom} className="inputFormulaire" />
        </div>
        <br />

        <div className="continer_input_formulaire">
          <div>Annee: </div>
          <input type="text" onChange={handleChange} name="annee"  value={group.annee} className="inputFormulaire" />
        </div>
        <br />

        <div className="continer_input_formulaire">
          <div>Nombre des etudient : </div>
          <input type="text" onChange={handleChange} name="nbrEtudient"  value={group.nbrEtudient} className="inputFormulaire" />
        </div>
        <br />
        <div className="continer_input_formulaire">
            <div>Niveau: </div>
            <select  name="niveau" onChange={handleChange} value={group.niveau} className="inputFormulaire">
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
            <div>Filier: </div>
            <select name="filier" onChange={handleChange} value={group.filier} className="inputFormulaire">
              <option value="">Choisire un Filier</option>
              {filier.map((f,i)=>(                
                <option key={i} value={f._id}>{f.nom}</option>
              ))}
            </select>
          </div>
<br />

        <input type="button" value={formulaireBtn} onClick={submitBtn} className='inputBtnFormulaire' />&nbsp;
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
      <Bar data={groupData}/>
        </center>
      </div>
      <br />
      <div className="barItem">
        <center>
          <h3>Nombre des Group pour chaque annee</h3>
      <Bar data={anneeData}/>
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
                 <input type="text" name="nom" placeholder='nom'   onChange={handleChangeSearch} className="inputSearch"/><br /><br />
                 <input type="text" name="annee" placeholder='annee'   onChange={handleChangeSearch} className="inputSearch" />
          </div>
          <br />
          <div className="contianerInputSearch">
      <select name="niveau"    onChange={handleChangeSearch} className="inputSearch selectInput">
           <option value="">Choisire un niveau</option>
           <option value="S1">S1</option>
           <option value="S2">S2</option>
           <option value="S3">S3</option>
           <option value="S4">S4</option>
           <option value="S5">S5</option>
           <option value="S6">S6</option>
          </select><br /><br />          
          <select name="filier"    onChange={handleChangeSearch} className="inputSearch selectInput">
           <option value="">Choisire un Filier</option>
           {filier.map((f,i)=>(                
                <option key={i} value={f._id}>{f.nom}</option>
              ))}
          </select>

          </div>
          <br />
          <div className="contianerInputSearch">
                 <input type="text" name="nbrEtudient" placeholder='Nombre des etudient'  onChange={handleChangeSearch} className="inputSearch" />
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
          
          <th>Filier</th>
          <th>Nom</th>
          <th>Annee</th>
          <th>Niveau</th>
          <th>Nombre des etudient</th>
          <th colSpan={3}>Option</th>
      </tr>
      
      {
        groups.map((g,i)=>(
          <tr key={i}>
          <td>{g.filier.nom} </td>
          <td>{g.nom} </td>
          <td>{g.annee} </td>
          <td>{g.niveau} </td>
          <td>{g.nbrEtudient} </td>
          <td><ImBin  onClick={deleteGroup.bind(this,g._id)} className="Icon Icon_delete"/></td>
          <td><ImPencil onClick={updateGroup.bind(this,g)} className="Icon Icon_update"/></td>
      </tr>

        ))
     } 
      </tbody>

  </table>
  </div>

       </div>
       <br />
         <input type="button" onClick={pagination.bind(this,-5)} value="<"  className="btn_pagination" />

{groups.length==5?(
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

export default Group