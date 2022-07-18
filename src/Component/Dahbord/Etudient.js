import React,{useState,useEffect} from 'react'
import Menu from "../Menu/Menu"
import {API_URL} from "../config";
import toastr from 'toastr';
import "toastr/build/toastr.css";
import { ImBin,ImPencil,ImNotification } from "react-icons/im";
import {IoIosMenu} from "react-icons/io";
import {AiOutlineSend} from "react-icons/ai";
import {Bar,Doughnut,Bubble} from "react-chartjs-2";
import Chart from 'chart.js/auto';


function Etudient() {
    const [menu,setMenu]=useState(true);
    const [formulaire,setFormulaire]=useState(true);
    const [formulaireBtn,setFormulaireBtn]=useState("Ajouter");
    const [group,setGroup]=useState([]);
    const [skip,setSkip]=useState(0);
    const [idEtudient,setIdetudient]=useState("");
    const [etudient,setEtudient]=useState({
        nom:"",
        prenom:"",
        email:"",
        tel:"",
        niveau:"",
        group:""
    });
    const [formdata,setFormdata]=useState(new FormData());
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
        setEtudient({
            nom:"",
            prenom:"",
            email:"",
            tel:"",
            niveau:"",
            group:""
        });
        getAll(skip);
      }
    
     const handleChange=(e)=>{
        const value=e.target.name=="photo"?e.target.files[0]:e.target.value;
        if(e.target.name=="niveau"){
            fetch(`${API_URL}/etudient/getGroup/${e.target.value}`,{
                method:"GET",
                headers:{
                   "Accept":"application/json",
                   "Content-Type":"application/json"
                }
            }
            ).then(res=>res.json()).then(res=>{
                if(res.g)
                setGroup(res.g);
                else 
                console.log(res);
            }).catch(err=>console.log(err));
        }
            formdata.set(e.target.name,value);        
            setEtudient({...etudient,[e.target.name]:value});    
     }
     const submitBtn=()=>{
      if(formulaireBtn=="Ajouter"){
        fetch(`${API_URL}/etudient/add`,{
          method: 'POST',
          headers:{
            "Accept":"application/json"
          },
          body:formdata
        }).then(res=>res.json()).then(res=>{
            if(res.err)
            toastr.warning(`${res.err}`,"Operation invalide !!",{positionClass:"toast-bottom-right"});
            if(res.msg){
                toastr.success(`${res.msg}`,"Operation valide !!",{positionClass:"toast-bottom-right"});
                hideFormulaire();
                
            }
            else
            console.log(res);
        }).catch(err=>console.log(err));

      }else{
        fetch(`${API_URL}/etudient/update/${idEtudient}`,{
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
              
          }
          else
          console.log(res);
        })
      }
     }
     const pagination=(pa)=>{      
        if(skip+pa>=0){
         setSkip(skip+pa)
         getAll(skip+pa)
        }
      }

     const [etudients,setEtudients]=useState([]);
     const getAll=(p)=>{
       fetch(`${API_URL}/etudient/getAll/${p}`,{
        method:"POST",
        headers:{
            "Accept":"application/json",
            "Content-Type":"application/json"
        },
        body:JSON.stringify(search)
       }).then(res=>res.json()).then(res=>{
          if(res.e)
            setEtudients(res.e);
            console.log(res);
       }).catch(err=>console.log(err));
     }
     const deleteEtudient=(_id)=>{
      if(window.confirm("Voulez vous vraiment supprimer cet etudient ?")==true)
      fetch(`${API_URL}/etudient/delete/${_id}`,{
        method:"DELETE",
        headers:{
          "Accept":"application/json",
          "Content-Type":"application/json"
        }
      }).then(res=>res.json()).then(res=>{
        if(res.msg)
        {
          toastr.success(`${res.msg}`,"Operation valide !!",{positionClass:"toast-bottom-right"});
          getAll(skip);
        }
        else
        console.log(res);
      }).catch(err=>console.log(err));
     }
     const updateEtudient=(e)=>{
      setEtudient({
        nom:e.nom,
        prenom:e.prenom,
        email:e.email,
        tel:e.tel,
        niveau:e.niveau,
        group:e.group._id
    });
    // formdata=new FormData()
    formdata.set("nom",e.nom);
    formdata.set("prenom",e.prenom);
    formdata.set("email",e.email);
    formdata.set("tel",e.tel);
    formdata.set("niveau",e.niveau);
    formdata.set("group",e.group._id);
    setIdetudient(e._id);
    setFormulaireBtn("Moddifier");
    showFormulaire();
 }
 const [detailForm,setDetailForm]=useState(true);
 const hideDetailCard=()=>{
  setDetailForm(true);
 }
 const [detaileEtudient,setDetaileEtudient]=useState({
  image:"",
  nom:"",
  prenom:"",
  email:"",
  tel:"",
  niveau:"",
  group:"",
  annee:"",
  niveau:""
});


 const detailEtudient=(e)=>{
  setDetailForm(false);
  setDetaileEtudient({
    image:`${API_URL}/etudient/getImage/${e._id}`,
    nom:e.nom,
    prenom:e.prenom,
    email:e.email,
    tel:e.tel,
    niveau:e.group.niveau,
    group:e.group.nom,
    annee:e.group.annee 
  })
 }
 const [search,setSearch]=useState({
  nom:"",
  prenom:"",
  email:"",
  tel:"",
  niveau:"",
  group:""

 });
const handleChangeSearch=(e)=>{
  if(e.target.name=="niveau"){
    fetch(`${API_URL}/etudient/getGroup/${e.target.value}`,{
        method:"GET",
        headers:{
           "Accept":"application/json",
           "Content-Type":"application/json"
        }
    }
    ).then(res=>res.json()).then(res=>{
        if(res.g)
        setGroup(res.g);
        else 
        console.log(res);
    }).catch(err=>console.log(err));
}
setSearch({...search,[e.target.name]:e.target.value});
}
const searchBtn=()=>{
  getAll(skip);

}
     var label1=[];
     var data1=[];
     var label2=[];
     var data2=[];
     const [chartData1,setChartData1]=useState({
      labels:label1,
      datasets:[{
       label:"Nombre des Group pour chaque annee",
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
     const getData2=()=>{
      fetch(`${API_URL}/etudient/chart2`,{
        method:"GET",
        headers:{
          "Accept":"application/json",
          "Content-Type":"application/json"
        }
      }).then(res=>res.json()).then(res=>{
        if(res.c){
         label2=[];
         data2=[];
         for(const data of res.c){
          label2.push(data.group[0].nom);
          data2.push(data.count);
         }
         setChartData2({
          labels:label2,
          datasets:[{
           label:"Nombre des etudient pour chaque group",
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
        }else
        console.log(res)
      }).catch(err=>console.log(err));

     }
     const getData1=()=>{
      fetch(`${API_URL}/etudient/chart1`,{
        method:"GET",
        headers:{
          "Accept":"application/json",
          "Content-Type":"application/json"
        }
      }).then(res=>res.json()).then(res=>{
        if(res.c){
         label1=[];
         data1=[];
         for(const data of res.c){
          label1.push(data.group[0].nom);
          data1.push(data.count);
         }
         setChartData1({
          labels:label1,
          datasets:[{
           label:"Nombre des etudient pour chaque group",
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
        }else
        console.log(res)
      }).catch(err=>console.log(err));
     }
     const [chartData2,setChartData2]=useState({
      labels:label2,
      datasets:[{
       label:"Nombre des Group pour chaque annee",
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
     const options= {
      responsive: true,
      maintainAspectRatio: true,
      percentageInnerCutout : 20,
      cutoutPercentage: 200
   }
    const emailEtudient=(e)=>{
     setEmailTo(e.email);
     setEmailCard(false);
     }
     const [email,setEmail]=useState({objet:"",message:""});
     const [emailTo,setEmailTo]=useState("");
     const handleChngeEmail=(e)=>{
       setEmail({...email,[e.target.name]:e.target.value});
     }
    const [emailCard,setEmailCard]=useState(true);
     useEffect(()=>{
      getData1();
        getAll(skip);
     },[]);
     const hideCardEmail=()=>{
      setEmailCard(true);
      setEmail({
       objet:"",message:""
      })
      }
 
     const sendEmail=()=>{
       fetch(`${API_URL}/etudient/sendEmail/${emailTo}`,{
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
    {/* detail card */}
    <div className={detailForm?"detailForm":"showDailForm"}>
       <center>
        <h3>Les detail de etudient</h3>
        <div className="containerDetail">
        <div className="conatinerInputDetail">
          <center>
          <img className='image_table_detail' src={detaileEtudient.image} alt="" />
          </center>
        </div>
        <div className="conatinerInputDetail">
          <div><h3>Nom :</h3></div>
          <div>{detaileEtudient.nom}</div>
        </div>
        <div className="conatinerInputDetail">
          <div><h3>Prenom :</h3></div>
          <div>{detaileEtudient.prenom}</div>
        </div>

        <div className="conatinerInputDetail">
          <div><h3>Email: </h3></div>
          <div>{detaileEtudient.email}</div>
        </div>
        <div className="conatinerInputDetail">
          <div><h3>Telephone: </h3></div>
          <div>{detaileEtudient.tel}</div>
        </div>
        <div className="conatinerInputDetail">
          <div><h3>Niveau:</h3></div>
          <div>{detaileEtudient.niveau}</div>
        </div>
        <div className="conatinerInputDetail">
          <div><h3>Annee : </h3></div>
          <div>{detaileEtudient.annee}</div>
        </div>
        <div className="conatinerInputDetail">
          <div><h3>Group : </h3></div>
          <div>{detaileEtudient.group}</div>
        </div>

        </div>
        <br />
        <input type="button" value="Reteur" onClick={hideDetailCard} className='inputBtnFormulaire' />
       </center>
      </div>|
    {/* detail card */}
    <div className={formulaire?"formulaire":"showFormulaire"}>
      <center>
        <h3>Formulaire Etudient</h3>
        <br/>
        <div className="continer_input_formulaire">
          <div>Image: </div>
          <input type="file" name="photo"  onChange={handleChange}   className="inputFormulaire" />
        </div>
        <br />

        <div className="continer_input_formulaire">
          <div>Nom: </div>
          <input type="text" name="nom"  value={etudient.nom} onChange={handleChange}  className="inputFormulaire" />
        </div>
        <br />

        <div className="continer_input_formulaire">
          <div>Prenom: </div>
          <input type="text" name="prenom"  value={etudient.prenom} onChange={handleChange}  className="inputFormulaire" />
        </div>
        <br />
        <div className="continer_input_formulaire">
          <div>Email: </div>
          <input type="text" name="email"  value={etudient.email} onChange={handleChange}  className="inputFormulaire" />
        </div>
        <br />
        <div className="continer_input_formulaire">
          <div>Telephone: </div>
          <input type="text" name="tel"  value={etudient.tel} onChange={handleChange}  className="inputFormulaire" />
        </div>
        <br />

        <div className="continer_input_formulaire">
            <div>Niveau: </div>
            <select  name="niveau"   value={etudient.niveau} onChange={handleChange}  className="inputFormulaire">
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
            <div>Group: </div>
            <select name="group" value={etudient.group}  onChange={handleChange} className="inputFormulaire">
              <option value="">Choisire un Filier</option>
              {group.map((g,i)=>(                
                <option key={i} value={g._id}>{g.nom}</option>
              ))}
            </select>
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
          <h3>Bar chart Nombre des Group par filier</h3>
      <Bar data={chartData1}/>
        </center>
      </div>
      <br />
      <div className="barItem">
        <center>
          <h3>Doughnut de chart Nombre des Group pour chaque annee</h3>
     <div style={{width: '60%',position: 'relative'}}>
      <Doughnut  data={chartData1} options={options}/>
     </div>

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
          <select  name="niveau"  onChange={handleChangeSearch} className="inputSearch selectInput">
             <option value="">Choisire un niveau</option>
             <option value="S1">S1</option>
             <option value="S2">S2</option>
             <option value="S3">S3</option>
             <option value="S4">S4</option>
             <option value="S5">S5</option>
             <option value="S6">S6</option>
            </select><br /><br />
            <select name="group" onChange={handleChangeSearch} className="inputSearch selectInput">
              <option value="">Choisire un Filier</option>
              {group.map((g,i)=>(                
                <option key={i} value={g._id}>{g.nom}</option>
              ))}
            </select>
          </div>
          <br />
          
          <input type="Button" value="Chercher" onClick={searchBtn}  className="inputBtnSearch" />

        </center>
      </div>
     <input type="Button" value="Novelle" onClick={showFormulaire} className="btn_mewItem" />
     <br />
     <br />
     <div className='tableList'>

     <table>
      <tbody>
 
      <tr id="header">
          <th>Etudient</th>
          <th>Nom</th>
          <th>Prenom</th>
          <th>Email</th>
          <th>Telephone</th>
          <th>Group</th>
          <th colSpan={4}>Option</th>
      </tr>      
      {
        etudients.map((e,i)=>(
          <tr key={i}>
          <td> <img className='image_table' src={`${API_URL}/etudient/getimage/${e._id}`} /> </td>
          <td>{e.nom} </td>
          <td>{e.prenom} </td>
          <td>{e.email} </td>
          <td>{e.tel}</td>
          <td>{e.group.nom}</td>
          <td><ImBin  onClick={deleteEtudient.bind(this,e._id)}  className="Icon Icon_delete"/></td>
          <td><ImPencil onClick={updateEtudient.bind(this,e)} className="Icon Icon_update"/></td>
          <td><ImNotification onClick={detailEtudient.bind(this,e)} className="Icon Icon_details"/></td>
          <td><AiOutlineSend onClick={emailEtudient.bind(this,e)} className="Icon Icon_email"/></td>
          
      </tr>

        ))
      } 
      </tbody>

  </table>
  </div>

       </div>
       <br />
         <input type="button" onClick={pagination.bind(this,-5)} value="<"  className="btn_pagination" />

{etudients.length==5?(
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

export default Etudient;